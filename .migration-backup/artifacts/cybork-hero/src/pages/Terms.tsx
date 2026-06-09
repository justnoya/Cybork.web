import LegalPage from "./LegalPage";

export default function Terms() {
  return (
    <LegalPage
      title="TERMS"
      lastUpdated="JUNE 2025"
      sections={[
        {
          heading: "Acceptance of Terms",
          body: "By adding Cybork to your Discord server or using any of its features, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the bot. These terms apply to all users, server administrators, and members who interact with Cybork.",
        },
        {
          heading: "Description of Service",
          body: "Cybork is a Discord bot that provides moderation, music playback, leveling, economy, and utility features for Discord servers. The service is provided free of charge. We reserve the right to modify, suspend, or discontinue any feature at any time without notice.",
        },
        {
          heading: "Acceptable Use",
          body: (
            <>
              You agree not to use Cybork to:
              <ul style={{ marginTop: "10px", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <li>Harass, abuse, or harm other users or communities</li>
                <li>Distribute spam, malware, or illegal content</li>
                <li>Circumvent rate limits, abuse commands, or attempt to exploit the bot</li>
                <li>Violate Discord's Terms of Service or Community Guidelines</li>
                <li>Engage in any activity that disrupts or degrades the service for others</li>
              </ul>
            </>
          ),
        },
        {
          heading: "Server Administrator Responsibilities",
          body: "Server administrators who add Cybork are responsible for ensuring the bot is configured and used appropriately within their communities. Administrators are responsible for all activity that occurs within their servers, including the actions of their members when using Cybork's features.",
        },
        {
          heading: "Intellectual Property",
          body: "Cybork, its name, logo, and all associated content are the intellectual property of the Cybork development team. You may not reproduce, distribute, or create derivative works without explicit written permission. The Cybork name and logo are not affiliated with or endorsed by Discord Inc.",
        },
        {
          heading: "Limitation of Liability",
          body: "Cybork is provided \"as is\" without warranties of any kind. We are not liable for any damages arising from your use of the bot, including but not limited to data loss, server disruptions, or any indirect, incidental, or consequential damages. Use of the service is at your own risk.",
        },
        {
          heading: "Termination",
          body: "We reserve the right to ban any user or server from using Cybork at any time for any reason, including violations of these terms. You may remove Cybork from your server at any time. Termination of access does not affect any provisions of these terms that are intended to survive termination.",
        },
        {
          heading: "Changes to Terms",
          body: "We may update these Terms of Service at any time. Continued use of Cybork after changes are posted constitutes your acceptance of the new terms. We recommend reviewing this page periodically for any updates.",
        },
        {
          heading: "Contact",
          body: <>For questions about these terms, reach us through our <a href="/support" style={{ color: "rgb(100,106,118)", textDecoration: "underline" }}>support page</a> or join our Discord server.</>,
        },
      ]}
    />
  );
}
