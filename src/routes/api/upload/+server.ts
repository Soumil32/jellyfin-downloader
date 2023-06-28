import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import fs from 'fs';


export const POST: RequestHandler = async (event) => {
    console.log('POST /api/upload');
    const formData = await event.request.formData();
    const files = formData.getAll('files');
    console.log(files);
    for (let file of files) {
        console.log(file);
        file = file as File
        console.log(file.name);
    }
    
    return json('');
};