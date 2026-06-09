import LegalPage from "./LegalPage";

const DISCORD_SUPPORT = "https://discord.com/oauth2/authorize";

export default function Support() {
  return (
    <LegalPage
      title="SUPPORT"
      lastUpdated="JUNE 2025"
      sections={[
        {
          heading: "Getting Help",
          body: (
            <>
              The fastest way to get support is to join the Cybork support server on Discord. Our team and community are available around the clock to help with setup, troubleshooting, and feature questions.{" "}
              <a href={DISCORD_SUPPORT} style={{ color: "rgb(100,106,118)", textDecoration: "underline" }}>
                Join the support server →
              </a>
            </>
          ),
        },
        {
          heading: "Common Issues",
          body: (
            <>
              <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <li>
                  <strong style={{ color: "rgba(255,255,255,0.4)" }}>Bot is offline or unresponsive</strong>
                  <br />Check our status page or the support server for ongoing incidents. Try re-inviting the bot if it has been removed.
                </li>
                <li>
                  <strong style={{ color: "rgba(255,255,255,0.4)" }}>Commands not working</strong>
                  <br />Ensure Cybork has the required permissions in the channel. Use <code style={{ background: "rgba(255,255,255,0.07)", padding: "1px 6px", fontSize: "11px" }}>/help</code> to see available commands and their required permissions.
                </li>
                <li>
                  <strong style={{ color: "rgba(255,255,255,0.4)" }}>Music not playing</strong>
                  <br />Make sure Cybork has permissions to join and speak in your voice channel. Verify the audio source URL or search term is valid.
                </li>
                <li>
                  <strong style={{ color: "rgba(255,255,255,0.4)" }}>Moderation actions not triggering</strong>
                  <br />Check that the bot's role is higher than the roles it needs to moderate. Review auto-moderation settings with <code style={{ background: "rgba(255,255,255,0.07)", padding: "1px 6px", fontSize: "11px" }}>/config mod</code>.
                </li>
              </ul>
            </>
          ),
        },
        {
          heading: "Invite & Setup",
          body: (
            <>
              To add Cybork to your server:
              <ol style={{ marginTop: "10px", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <li>Click "Add to Discord" — you need Manage Server permission</li>
                <li>Select your server and authorise the required permissions</li>
                <li>Run <code style={{ background: "rgba(255,255,255,0.07)", padding: "1px 6px", fontSize: "11px" }}>/setup</code> to configure the bot for your server</li>
                <li>Use <code style={{ background: "rgba(255,255,255,0.07)", padding: "1px 6px", fontSize: "11px" }}>/help</code> to explore all available commands</li>
              </ol>
            </>
          ),
        },
        {
          heading: "Required Permissions",
          body: (
            <>
              Cybork requires the following Discord permissions to operate fully:
              <ul style={{ marginTop: "10px", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <li>Read Messages / View Channels</li>
                <li>Send Messages &amp; Embeds</li>
                <li>Manage Messages (for moderation)</li>
                <li>Kick Members &amp; Ban Members (for moderation)</li>
                <li>Connect &amp; Speak (for music features)</li>
                <li>Use Application Commands</li>
              </ul>
            </>
          ),
        },
        {
          heading: "Feature Requests & Bug Reports",
          body: (
            <>
              Found a bug or have a feature idea? Head to our support Discord server and use the dedicated <strong style={{ color: "rgba(255,255,255,0.4)" }}>#bug-reports</strong> or <strong style={{ color: "rgba(255,255,255,0.4)" }}>#feature-requests</strong> channels. Please include your server ID and a description of the issue or idea.{" "}
              <a href={DISCORD_SUPPORT} style={{ color: "rgb(100,106,118)", textDecoration: "underline" }}>
                Join the server →
              </a>
            </>
          ),
        },
        {
          heading: "Data Deletion Requests",
          body: <>To request deletion of your server or user data, join the support server and open a ticket in <strong style={{ color: "rgba(255,255,255,0.4)" }}>#data-requests</strong>. We process deletion requests within 30 days. See our <a href="/privacy" style={{ color: "rgb(100,106,118)", textDecoration: "underline" }}>Privacy Policy</a> for details on what data we hold.</>,
        },
        {
          heading: "Response Times",
          body: (
            <>
              <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <li><strong style={{ color: "rgba(255,255,255,0.4)" }}>General support:</strong> Within 24 hours on the Discord server</li>
                <li><strong style={{ color: "rgba(255,255,255,0.4)" }}>Bug reports:</strong> Acknowledged within 48 hours; fixes deployed as soon as possible</li>
                <li><strong style={{ color: "rgba(255,255,255,0.4)" }}>Data requests:</strong> Within 30 days as required by applicable law</li>
                <li><strong style={{ color: "rgba(255,255,255,0.4)" }}>Critical outages:</strong> Responded to immediately by on-call team</li>
              </ul>
            </>
          ),
        },
      ]}
    />
  );
}
