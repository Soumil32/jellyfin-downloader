import type { PageServerLoad, Actions } from './$types';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async (event) => {
        const formData = await event.request.formData();
        const files = formData.getAll('files');
        for (let file of files) {
            console.log(file);
        }
    }
}