export type ActionStatus = "idle" | "ok" | "demo" | "error";

export interface ActionResult {
  status: ActionStatus;
  message?: string;
  fieldErrors?: Record<string, string>;
}

export const IDLE: ActionResult = { status: "idle" };

export const DEMO_RESULT: ActionResult = {
  status: "demo",
  message: "Demo mode — your changes were validated but not saved.",
};
