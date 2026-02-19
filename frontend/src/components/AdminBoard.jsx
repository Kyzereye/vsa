import { useState, useMemo } from "react";
import ConfirmDialog from "./ConfirmDialog";

// 18 fixed slots: 1 President, 1 VP, 1 Financial Secretary, 6 Board Member, 9 Advisor to the Board
const SLOT_LABELS = [
  "President",
  "Vice President",
  "Financial Secretary",
  ...Array(6).fill("Board Member"),
  ...Array(9).fill("Advisor to the Board"),
];

function AdminBoard({ boardMembers = [], onAdd, onUpdate, onRemove }) {
  const [assigningSlot, setAssigningSlot] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "" });
  const [removeConfirmId, setRemoveConfirmId] = useState(null);

  const slots = useMemo(() => {
    const result = SLOT_LABELS.map((positionLabel, slotIndex) => ({ slotIndex, positionLabel, member: null }));

    const president = boardMembers.find((m) => m.boardPosition === "President");
    const vp = boardMembers.find((m) => m.boardPosition === "Vice President");
    const finSec = boardMembers.find((m) => m.boardPosition === "Financial Secretary");
    const board = boardMembers.filter((m) => m.boardPosition === "Board Member").sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    const advisors = boardMembers.filter((m) => m.boardPosition === "Advisor to the Board").sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

    if (president) result[0].member = president;
    if (vp) result[1].member = vp;
    if (finSec) result[2].member = finSec;
    board.forEach((m, i) => { if (result[3 + i]) result[3 + i].member = m; });
    advisors.forEach((m, i) => { if (result[9 + i]) result[9 + i].member = m; });

    return result;
  }, [boardMembers]);

  const getDisplayOrderForSlot = (slotIndex) => {
    if (slotIndex >= 3 && slotIndex <= 8) return slotIndex - 3;
    if (slotIndex >= 9 && slotIndex <= 17) return slotIndex - 9;
    return 0;
  };

  const handleStartAssign = (slot) => {
    setAssigningSlot(slot.slotIndex);
    setEditingId(null);
    setFormData({ name: "" });
  };

  const handleEdit = (member) => {
    setEditingId(member.id);
    setAssigningSlot(null);
    setFormData({ name: member.name });
  };

  const handleCancel = () => {
    setAssigningSlot(null);
    setEditingId(null);
    setFormData({ name: "" });
  };

  const handleSaveAssign = () => {
    if (assigningSlot == null || !formData.name.trim()) return;
    const slot = slots[assigningSlot];
    if (!slot || slot.member) return;
    onAdd({
      name: formData.name.trim(),
      boardPosition: slot.positionLabel,
      imageUrl: null,
      displayOrder: getDisplayOrderForSlot(assigningSlot),
    });
    handleCancel();
  };

  const handleSaveEdit = () => {
    if (!editingId || !formData.name.trim()) return;
    onUpdate(editingId, { name: formData.name.trim() });
    handleCancel();
  };

  const handleRemoveClick = (id) => setRemoveConfirmId(id);
  const handleRemoveConfirm = () => {
    if (removeConfirmId != null) {
      onRemove(removeConfirmId);
      handleCancel();
    }
    setRemoveConfirmId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <ConfirmDialog
        open={removeConfirmId != null}
        onClose={() => setRemoveConfirmId(null)}
        onConfirm={handleRemoveConfirm}
        title="Remove from Leadership?"
        message="This person will no longer appear on the Leadership page."
        confirmLabel="Remove"
        cancelLabel="Cancel"
        variant="danger"
      />
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 className="section-title" style={{ margin: 0 }}>Leadership</h2>
      </div>

      <p style={{ color: "var(--text-gray)", marginBottom: "1rem", fontSize: "0.9rem" }}>
        Executive Committee (3), then 6 Board Members, then 9 Advisors to the Board. Assign a name to each slot or leave empty.
      </p>

      {(assigningSlot != null || editingId != null) && (
        <div className="admin-form-card">
          <h4>{editingId ? "Edit" : "Assign"}</h4>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              editingId ? handleSaveEdit() : handleSaveAssign();
            }}
          >
            <div className="admin-form-grid">
              <div>
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="admin-input"
                  placeholder="Full name"
                />
              </div>
            </div>
            <div className="admin-form-actions">
              <button type="submit" className="admin-btn admin-btn-save">
                Save
              </button>
              <button type="button" className="admin-btn admin-btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {slots.map(({ slotIndex, positionLabel, member }) => (
              <tr key={slotIndex}>
                <td>{positionLabel}</td>
                <td>
                  {editingId === member?.id ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSaveEdit();
                        }
                      }}
                      className="admin-input"
                    />
                  ) : (
                    member?.name ?? ""
                  )}
                </td>
                <td>
                  {editingId === member?.id ? (
                    <div className="admin-actions">
                      <button type="button" className="admin-btn admin-btn-save" onClick={handleSaveEdit}>
                        Save
                      </button>
                      <button type="button" className="admin-btn admin-btn-cancel" onClick={handleCancel}>
                        Cancel
                      </button>
                    </div>
                  ) : member ? (
                    <div className="admin-actions">
                      <button type="button" className="admin-btn admin-btn-edit" onClick={() => handleEdit(member)}>
                        Edit
                      </button>
                      <button type="button" className="admin-btn admin-btn-delete" onClick={() => handleRemoveClick(member.id)}>
                        Remove
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="admin-btn admin-btn-save"
                      onClick={() => handleStartAssign({ slotIndex, positionLabel, member: null })}
                    >
                      Assign
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminBoard;
