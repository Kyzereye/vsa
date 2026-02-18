import { Link } from "react-router-dom";

const ABOUT_PARAGRAPHS = [
  "The Veterans Sportsmens Association (VSA) is composed of Veterans and Civilians alike who take pride in honoring All Veterans for their service and sacrifices.",
  "The Veterans Sportsmens Association (VSA) is a Federally recognized 501c3 Non-profit Organization, and we are located in Poughkeepsie, New York.",
  "VSA members are 100% nonpaid Volunteers. Absolutely all of the funds generated through fundraising and donations assist local Veterans, Guard, Reserve and Active duty military and their families. We provide Veteran sponsored shooting events, firearms training, and other outdoor activities within the Hudson Valley Region.",
  "The VSA is a proud member of the National Shooting Sports Foundation (NSSF)",
];

function PrivacyContent() {
  return (
    <section id="privacy" className="privacy-section">
      <h2 className="section-title">Privacy Policy</h2>
      <div className="about-content">
        <p>
          This online privacy statement is to help you understand how we handle your information. By using our website, you agree to the collection, use and disclosure of your personal information as described in this Policy. If you do not consent to the Policy, you should not use our website.
        </p>
        <p>
          STRIDE strives to protect your information and will not distribute personal indentifying information to outside entities or companies without the consent of the user unless: (1) a service provided on this site requires interaction with or is provided by a third party that provides support services to us (such as credit card processors, mailing houses, web hosts, or providers of online reservation services) or that help us market our services (2) disclosure is made pursuant to legal process or law enforcement or (3) we find that your use of this site violates our Privacy Policy Terms and Conditions, other usage guidelines or as we deem reasonably necessary to protect our legal interests, rights and/or property.
        </p>
        <p>
          We do not knowingly accept registrations or collect personally identifying information from children who are under the age of 13 without the prior consent of the child&apos;s parents or guardian. If you believe that a child under the age of 13 may have provided personal information to us without the consent of the child&apos;s parent or guardian, please contact STRIDE at 518-598-1279 or info@stride.org.
        </p>
        <p>
          This policy is subject to change, and a revised policy may be posted. The changes will only apply to the personal information we collect. While this Privacy Policy states our standards for maintenance of personally identifying information, we cannot guarantee these standards. There may be factors beyond our control that may result in disclosure of data. As a consequence, we do not make any warranties or representations relating to maintenance or nondisclosure of personally identifying information.
        </p>
      </div>

      <h3 className="privacy-subtitle">Terms and Conditions</h3>
      <ol className="privacy-terms-list">
        <li>STRIDE, Inc.™ (&quot;STRIDE&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) provided access to this website free of charge to provide information about STRIDE, its programs, students and fundraising initiatives. By accessing this site you agree, without limitation or qualification, to abide by the terms and conditions set forth below and all applicable laws, statutes, ordinances and regulations. The sole authorized use of this site is to obtain information about STRIDE and no other use is permitted.</li>
        <li>STRIDE assumes no responsibility for the security of this sire or your communication with this site. It is strictly prohibited to link other sites with this site without written permission from STRIDE. We may permit some links for convenience, but STRIDE has no responsibility for the unaffiliated sites to which it may be linked or for material posted to this site by anyone other than STRIDE. You hereby irrevocably waive any claim against STRIDE with respect to linked sites or material posted by anyone else.</li>
        <li>We cannot guarantee or warrant the security of any data you submit to us. However, we will use reasonable efforts to provide for the confidentiality or emails, applications or inquiries sent to us for the purpose of seeking information.</li>
        <li>It is strictly prohibited to use or contact this site to disrupt its contents, security measures, or to harass STRIDE. We are not responsible for any user submitted content. We have the right, but not the obligation, to monitor submissions and we may remove content deemed inappropriate for any reason, without consent. We further reserve the right to remove a user&apos;s privilege to post content on our site. Posters are to follow STRIDE guidelines regarding posting on the site and may not post any information that is defamatory, profane, obscene or pornographic, violates any law, degraded anyone on the basis of gender, age, race, class, ethnicity, national origin, religion, sexual preferences, disability or other classification, is hateful or harasses the other users of the site, or which impersonates others.</li>
        <li>We are not responsible for timeliness, accuracy, unavailability or interruptions in availability, viruses or other defects in the site or its contents. This site is provided &quot;as is&quot; and without warranties of any kind either expressed or implied. To the fullest extent permissible, STRIDE disclaims all warranties, express or implied, including, but not limited to, implied warranties of merchantability and fitness for a particular purpose. In no event, is STRIDE responsible for any damages to users or their computer systems or otherwise, even if STRIDE is informed of the possibility of such damages and without regard to negligence. Local jurisdictions may prohibit the limitation of certain types of liability; therefore this section may not apply to you. In any event, STRIDE&apos;s total tort or contract liability to you for all damages, losses, and causes of action will not exceed the amount paid by you for accessing this site.</li>
        <li>Headquarters of STRIDE are located in Rensselaer, New York. This site and terms and conditions are subject to the substantive laws of the State of New York without regard to conflicts of law principles, and regardless of the location of the user, and exclusive jurisdiction and venue for any claims of any kind arising from or related to this site and these terms and conditions shall be in the Supreme Court of the State of New York, Rensselaer County, or in the United States District Court for the Northern District of New York. You hereby consent and submit to the jurisdiction of such courts for the purposes of litigating any such action.</li>
        <li>Use of this site is subject to all of the terms and conditions contained herein, which you as a user accept.</li>
        <li>This site is owned and operated by STRIDE. You may not reproduce, copy, republish, post, transmit, or distribute in any way material from this site, except that you may print or download one copy of the materials on any single computer for your personal, noncommercial use. You must keep all copyright, trademark and other proprietary notices intact. Your modification or use of the materials for any other purpose is a violation of our intellectual property rights. If you see permission to use our material, please contact our office at 518-598-1279 or info@stride.org.</li>
        <li>If you download anything from the site, the software is licensed to you by us for the limited use described above. We retain full and complete title to the software, and all intellectual property rights in it.</li>
        <li>STRIDE trademarks, service marks, and trade names are our sole property. You agree that because all the trademarks have great value and goodwill, in the event you breach this section, injury to STRIDE would be irreparable. Therefore, you consent to the issuance of injunctive relief and agree that injunctive relief would be appropriate and necessary to protect our interests (without limitation as to damages or other remedies allowable by law).</li>
        <li>While we try to be accurate and up to date, we cannot guarantee that information on the site will be accurate or timely.</li>
        <li>If any clause or provision of these terms and conditions shall be held invalid in whole or in part, then the remaining clauses and provisions, or portions thereof, shall remain in full effect.</li>
        <li>Our failure to insist upon strict compliance with any of the terms shall not be deemed a waiver, nor shall any waiver or relinquishment of any right at one or more times be deemed a waiver. No waiver shall be valid unless in writing and signed by an authorized officer of STRIDE.</li>
        <li>These Terms and Conditions may be changed or terminated at any time by STRIDE without notice. If you do not agree to our Terms and Conditions you must terminate your use of the website.</li>
      </ol>
    </section>
  );
}

function About({ teaser = false }) {
  const paragraphs = teaser ? ABOUT_PARAGRAPHS.slice(0, 2) : ABOUT_PARAGRAPHS;
  return (
    <>
      <section id="about">
        <div className="container">
          <h2 className="section-title">About Us</h2>
          <div className="about-content">
            {paragraphs.map((text, i) => (
              <p key={i}>{text}</p>
            ))}
            {teaser && (
              <p style={{ marginTop: "1rem" }}>
                <Link to="/about" className="cta-button" style={{ background: "var(--dark-gray)" }}>
                  Read full story
                </Link>
              </p>
            )}
          </div>
        </div>
      </section>
      {!teaser && (
        <div className="container">
          <PrivacyContent />
        </div>
      )}
    </>
  );
}

export default About;
export { PrivacyContent };
