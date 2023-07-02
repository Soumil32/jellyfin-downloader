import type { PageServerLoad, Actions } from './$types';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async (event) => {
        const { request } = event;
        const { body } = request;

        fetch(request)
    }
}