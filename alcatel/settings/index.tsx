registerSettingsPage(({ settings }) => (
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
  </Page>
));
