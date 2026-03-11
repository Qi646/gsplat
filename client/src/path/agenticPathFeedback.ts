export interface AgenticPathFailureFeedback {
  detail: string;
  message: string;
  title: string;
}

const DEFAULT_FAILURE_MESSAGE = 'Could not generate an agentic camera path.';

export function buildAgenticPathFailureFeedback(error: unknown): AgenticPathFailureFeedback {
  const message = error instanceof Error && error.message.trim().length > 0
    ? error.message
    : DEFAULT_FAILURE_MESSAGE;

  if (matchesAny(message, [
    /could not localize/i,
    /not enough (captured )?views/i,
    /not enough captures/i,
  ])) {
    return {
      detail:
        'Keep the subject centered and as unobstructed as possible in the current view, then retry. Dense foreground splats can hide it from the scout captures.',
      message,
      title: 'Subject Was Not Visible In Enough Scout Views',
    };
  }

  if (matchesAny(message, [
    /stable 3d subject anchor/i,
    /outside the loaded scene bounds/i,
    /triangulated/i,
  ])) {
    return {
      detail:
        'The planner saw the subject, but the recovered 3D anchor was not stable enough. Retry from a cleaner angle with more separation from nearby geometry.',
      message,
      title: 'Subject Anchor Could Not Be Resolved',
    };
  }

  if (matchesAny(message, [/route-following/i, /weav(e|ing) through/i, /multi-subject/i, /ambiguous/i])) {
    return {
      detail:
        'Agentic path v1 only supports one continuous subject-centric move. Rewrite the prompt around one primary subject instead of a route through geometry.',
      message,
      title: 'Prompt Is Outside V1 Scope',
    };
  }

  if (matchesAny(message, [/safe frame box/i, /supported scene volume/i, /too close to the subject/i, /fov outside/i])) {
    return {
      detail:
        'The draft was composed, but it failed local path validation. Retry with a simpler subject-centric move or reframe the scene before regenerating.',
      message,
      title: 'Draft Could Not Be Validated',
    };
  }

  if (matchesAny(message, [/timed out/i, /canceled/i])) {
    return {
      detail:
        'The current camera pose was restored. Retry once the scene is idle again, or reduce how much foreground clutter sits in front of the subject.',
      message,
      title: 'Path Generation Did Not Finish',
    };
  }

  return {
    detail:
      'Retry from a view where the subject is centered and clearly separated from foreground splats. If the problem repeats, move slightly and try again.',
    message,
    title: 'Path Generation Failed',
  };
}

function matchesAny(message: string, patterns: RegExp[]): boolean {
  return patterns.some(pattern => pattern.test(message));
}
