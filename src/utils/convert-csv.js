import { parse, stringify } from 'csv';
import fs from 'node:fs';

export async function importCsvFromFakeFile(){
    const parser = parse({
        delimiter: ';',
        from_line: 2
    });
    return fs.createReadStream(new URL('../fake-data/task-csv.csv', import.meta.url)).pipe(parser);
}

export function saveImportedTasks(tasks){
    return tasks.map(task => {
        return fetch(new URL('http://localhost:3335/tasks', import.meta.url), {
            method: 'POST',
            body: JSON.stringify(task),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    });
}

export function downloadFromStoredData(tasks){
    return stringify(tasks, {
        header: true,
        delimiter: ';'
    }, (err, output) => {
        if(err){
            throw Error(err);
        }
    });
}