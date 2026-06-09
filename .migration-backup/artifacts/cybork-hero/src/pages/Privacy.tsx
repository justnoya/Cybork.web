import LegalPage from "./LegalPage";

export default function Privacy() {
  return (
    <LegalPage
      title="PRIVACY"
      lastUpdated="JUNE 2025"
      sections={[
        {
          heading: "Overview",
          body: "Your privacy matters. This policy explains what data Cybork collects, how it is used, and how it is protected. Cybork is designed with a minimal data footprint — we only collect what is necessary to provide and improve the service.",
        },
        {
          heading: "Data We Collect",
          body: (
            <>
              Cybork collects only the data required to function:
              <ul style={{ marginTop: "10px", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <li><strong style={{ color: "rgba(255,255,255,0.4)" }}>User IDs</strong> — to track XP, economy balance, and per-user settings</li>
                <li><strong style={{ color: "rgba(255,255,255,0.4)" }}>Server IDs</strong> — to store server-specific configuration and preferences</li>
                <li><strong style={{ color: "rgba(255,255,255,0.4)" }}>Command usage data</strong> — aggregated and anonymised, used for diagnostics</li>
                <li><strong style={{ color: "rgba(255,255,255,0.4)" }}>Message content</strong> — only when explicitly required by a command (e.g. /say, auto-moderation triggers); never stored long-term</li>
              </ul>
            </>
          ),
        },
        {
          heading: "Data We Do NOT Collect",
          body: (
            <>
              We do not collect:
              <ul style={{ marginTop: "10px", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <li>Your email address, IP address, or real name</li>
                <li>Private messages or DMs</li>
                <li>Payment or financial information</li>
                <li>Messages from channels where Cybork is not active</li>
              </ul>
            </>
          ),
        },
        {
          heading: "How We Use Your Data",
          body: "Data collected is used solely to operate Cybork's features — powering leaderboards, economy balances, server configs, and moderation logs. We do not sell, rent, or share your data with third parties for marketing or advertising purposes.",
        },
        {
          heading: "Data Retention",
          body: "User and server data is retained for as long as Cybork is active in your server. If you remove Cybork from your server, server configuration data is deleted within 30 days. Individual user data (XP, economy) may be retained for up to 90 days after the bot's removal to allow for re-addition. You may request immediate deletion by contacting support.",
        },
        {
          heading: "Data Security",
          body: "We implement industry-standard security measures to protect your data, including encrypted connections, access controls, and regular security reviews. However, no system is 100% secure. We cannot guarantee absolute security of data transmitted over the internet.",
        },
        {
          heading: "Third-Party Services",
          body: "Cybork's music features may use third-party audio APIs. These services have their own privacy policies that govern their data practices. By using music features, you acknowledge that audio source metadata may be processed by these services.",
        },
        {
          heading: "Children's Privacy",
          body: "Cybork is not directed at children under the age of 13. We do not knowingly collect data from users under 13. Discord's own Terms of Service require all users to be at least 13 years of age. If you believe a user under 13 has interacted with Cybork, contact us immediately.",
        },
        {
          heading: "Your Rights",
          body: <>You have the right to request access to, correction of, or deletion of your personal data at any time. To exercise these rights, contact us via our <a href="/support" style={{ color: "rgb(100,106,118)", textDecoration: "underline" }}>support page</a>. We will respond within 30 days.</>,
        },
        {
          heading: "Policy Updates",
          body: "We may update this Privacy Policy from time to time. Significant changes will be communicated through our Discord support server. Continued use of Cybork after changes constitutes acceptance of the updated policy.",
        },
      ]}
    />
  );
}
