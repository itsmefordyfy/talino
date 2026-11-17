import type { WorkflowBuilderActivity } from '../types';
import { SAMPLE_ACTIVITIES } from '../samples';

/** The bakery sample (`sample-workflow-bakery-replies`) for the logic and screen tests. It is not course content: the Generative AI course's own workflows live in its lessons. */
export const SAMPLE_WORKFLOW = SAMPLE_ACTIVITIES.find((activity): activity is WorkflowBuilderActivity => activity.id === 'sample-workflow-bakery-replies')!;
