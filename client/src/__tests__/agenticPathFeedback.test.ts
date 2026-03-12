import { describe, expect, it } from 'vitest';
import { buildAgenticPathFailureFeedback } from '../path/agenticPathFeedback';

describe('buildAgenticPathFailureFeedback', () => {
  it('maps localization failures to a subject-visibility callout', () => {
    const feedback = buildAgenticPathFailureFeedback(
      new Error('The planner could not localize the requested subject in enough captured views.'),
    );

    expect(feedback.title).toBe('Subject Was Not Visible In Enough Scout Views');
    expect(feedback.detail).toMatch(/foreground splats/i);
  });

  it('maps unstable anchor failures to a triangulation callout', () => {
    const feedback = buildAgenticPathFailureFeedback(
      new Error('The planner could not resolve a stable 3D subject anchor from the scout views.'),
    );

    expect(feedback.title).toBe('Subject Anchor Could Not Be Resolved');
    expect(feedback.detail).toMatch(/cleaner angle/i);
  });

  it('maps route grounding failures to a route callout', () => {
    const feedback = buildAgenticPathFailureFeedback(
      new Error('The grounded route branches too early, so the planner could not choose one unambiguous traverse.'),
    );

    expect(feedback.title).toBe('Route Could Not Be Grounded Cleanly');
    expect(feedback.detail).toMatch(/unbranched route|competing branches|foreground clutter/i);
  });

  it('maps draft validation failures to a validation callout', () => {
    const feedback = buildAgenticPathFailureFeedback(
      new Error('Subject drifted out of the safe frame box.'),
    );

    expect(feedback.title).toBe('Draft Could Not Be Validated');
    expect(feedback.detail).toMatch(/failed local path validation/i);
  });

  it('falls back to a generic failure callout', () => {
    const feedback = buildAgenticPathFailureFeedback(new Error('Something unexpected happened.'));

    expect(feedback.title).toBe('Path Generation Failed');
    expect(feedback.message).toBe('Something unexpected happened.');
  });
});
