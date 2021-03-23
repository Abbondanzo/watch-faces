import { getLogs } from "./debug";

registerSettingsPage(({ settings }) => {
  const logs = getLogs(settings);
  console.log(JSON.stringify(settings));
  return (
    <Page>
      <Section
        title={
          <Text bold align="center">
            Alcatel Settings
          </Text>
        }
      >
        <Toggle settingsKey="weatherEnabled" label="Weather Enabled" />
        <Toggle settingsKey="secondsDial" label="Seconds Dial" />
        <ColorSelect
          settingsKey="backgroundColor"
          colors={[
            { color: "black" },
            { color: "sandybrown" },
            { color: "gold" },
            { color: "aquamarine" },
            { color: "deepskyblue" },
            { color: "plum" },
          ]}
        />
      </Section>
      <Section
        title={
          <Text bold align="center">
            Debug Settings
          </Text>
        }
      >
        {logs.length > 0 ? (
          logs.map((log, index) => (
            <Text key={index}>
              {log[1]}
              <TextImageRow sublabel={log[0]} />
            </Text>
          ))
        ) : (
          <Text italic>No logs</Text>
        )}
      </Section>
    </Page>
  );
});
