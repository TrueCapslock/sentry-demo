export default {
  name: "sentry-demo",
  // presets: ['react'],
  commands: [
    {
      id: "build",
      label: "Build",
      command: "npm run build",
    },
    {
      id: "Watch",
      label: "Watch",
      command: "npm run dev",
    },
    {
      id: "demo-errors",
      label: "Åpne demo (feilsporing)",
      command: 'start chrome "http://localhost:5173"',
    },
    {
      id: "sourcemap-glitchtip",
      label: "Last opp source maps → GlitchTip",
      command: [
        "where glitchtip-cli >nul 2>nul",
        "if errorlevel 1 (echo FEIL: glitchtip-cli er ikke installert. & echo Last ned fra: https://gitlab.com/glitchtip/glitchtip-cli/-/releases & pause & exit /b 1)",
        'for /f "usebackq delims=" %a in (`node -p "require(\'./package.json\').version"`) do set rel=%a',
        "echo ++ Injiserer debug-ID-er...",
        "glitchtip-cli sourcemaps inject ./dist",
        "if errorlevel 1 (echo FEIL under injisering & pause & exit /b 1)",
        "echo ++ Laster opp source maps...",
        "glitchtip-cli sourcemaps upload ./dist --release %rel%",
        "echo ++ Ferdig!",
        "pause",
      ].join(" && "),
    },
    {
      id: "sourcemap-sentry",
      label: "Last opp source maps → Sentry.io",
      command: ["npx @sentry/wizard@latest -i sourcemaps"],
      confirm: true,
    },
  ],
};
