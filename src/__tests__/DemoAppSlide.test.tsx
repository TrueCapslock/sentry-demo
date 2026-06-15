import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import DemoAppSlide, { pushLog } from "../slides/DemoAppSlide.tsx";

vi.mock("@sentry/react", async (importOriginal) => {
  const React = (await import("react")) as any;

  class ErrorBoundary extends React.Component {
    constructor(props: any) {
      super(props);
      this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error: unknown) {
      return { hasError: true, error };
    }
    render() {
      if (this.state.hasError) {
        return React.createElement(this.props.fallback, {
          error: this.state.error,
          componentStack: "",
          eventId: "test-event-id",
          resetError: () => this.setState({ hasError: false, error: null }),
        });
      }
      return this.props.children;
    }
  }

  return {
    setUser: vi.fn(),
    setTag: vi.fn(),
    setContext: vi.fn(),
    addBreadcrumb: vi.fn(),
    captureException: vi.fn(),
    captureFeedback: vi.fn(),
    startInactiveSpan: vi.fn(() => ({
      setAttribute: vi.fn(),
      setStatus: vi.fn(),
      end: vi.fn(),
    })),
    ErrorBoundary,
    withScope: vi.fn(),
  };
});

let consoleSpy: any;
beforeEach(() => {
  consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  consoleSpy?.mockRestore();
});

describe("DemoAppSlide", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the todo app", () => {
    render(<DemoAppSlide />);
    expect(screen.getByText("Live Demo — App med feil")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Skriv en todo...")).toBeInTheDocument();
  });

  it("adds a todo", async () => {
    const user = userEvent.setup();
    render(<DemoAppSlide />);

    const input = screen.getByPlaceholderText("Skriv en todo...");
    await user.type(input, "Kjøpe melk");
    await user.click(screen.getByText("Legg til"));

    expect(screen.getByText("Kjøpe melk")).toBeInTheDocument();
  });

  it("shows error when adding empty todo", async () => {
    const user = userEvent.setup();
    render(<DemoAppSlide />);

    await user.click(screen.getByText("Legg til"));

    expect(screen.getByText("Kan ikke legge til tom todo")).toBeInTheDocument();
  });

  it("removes a todo", async () => {
    const user = userEvent.setup();
    render(<DemoAppSlide />);

    await user.type(screen.getByPlaceholderText("Skriv en todo..."), "Oppgave");
    await user.click(screen.getByText("Legg til"));
    await user.click(screen.getAllByText("✕")[0]);

    expect(screen.queryByText("Oppgave")).not.toBeInTheDocument();
  });

  it("shows empty state when no todos", () => {
    render(<DemoAppSlide />);
    expect(screen.getByText("Ingen todos — legg til noen!")).toBeInTheDocument();
  });

  it("blocking delete on index 2 shows error", async () => {
    const user = userEvent.setup();
    render(<DemoAppSlide />);

    for (const t of ["A", "B", "C"]) {
      await user.type(screen.getByPlaceholderText("Skriv en todo..."), t);
      await user.click(screen.getByText("Legg til"));
    }
    await user.click(screen.getAllByText("✕")[2]);
    expect(screen.getByText("💥 Kunne ikke slette dette elementet")).toBeInTheDocument();
  });

  it("triggers render crash via crash button", () => {
    render(<DemoAppSlide />);
    fireEvent.click(screen.getByText("💥 Krasj"));
    expect(screen.getByText(/Appen krasjet/)).toBeInTheDocument();
  });

  it("opens and submits feedback modal", async () => {
    const user = userEvent.setup();
    render(<DemoAppSlide />);

    await user.click(screen.getByText("💬 Feedback"));
    expect(screen.getByText("💬 Send tilbakemelding")).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText("Beskriv hva du opplevde..."), "Dette var kult!");
    await user.click(screen.getByText("Send"));

    expect(screen.getByText("✅ Takk for tilbakemeldingen!")).toBeInTheDocument();
  });

  it("closes feedback modal on cancel", async () => {
    const user = userEvent.setup();
    render(<DemoAppSlide />);

    await user.click(screen.getByText("💬 Feedback"));
    await user.click(screen.getByText("Avbryt"));

    expect(screen.queryByText("💬 Send tilbakemelding")).not.toBeInTheDocument();
  });

  it("toggles Sentry dashboard view", async () => {
    const user = userEvent.setup();
    render(<DemoAppSlide />);

    await user.click(screen.getByText("📊 Sentry"));
    expect(screen.getByText(/Gå til Sentry Dashboard/)).toBeInTheDocument();

    await user.click(screen.getByText("Skjul"));
    expect(screen.queryByText(/Gå til Sentry Dashboard/)).not.toBeInTheDocument();
  });

  it("adds a todo via Enter key", async () => {
    const user = userEvent.setup();
    render(<DemoAppSlide />);

    const input = screen.getByPlaceholderText("Skriv en todo...");
    await user.type(input, "Enter-todo{Enter}");

    expect(screen.getByText("Enter-todo")).toBeInTheDocument();
  });

  it("pushLog entries appear in the event log", async () => {
    render(<DemoAppSlide />);
    await act(async () => {
      pushLog("Test-melding", "info");
    });
    expect(screen.getByText("Test-melding")).toBeInTheDocument();
  });
});
