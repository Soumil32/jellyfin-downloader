import type { PageServerLoad, Actions } from './$types';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async (event) => {
        const formData = await event.request.formData();
        const res = await fetch('http://localhost:3000/link', {
            method: 'POST',
            body: formData
        })

        if (res.ok) {
            return "Link added successfully"
        } else {
            return "Error adding link"
        }
    }
}