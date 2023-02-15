import fs from 'node:fs/promises';

export class Database{
    #database = {};

    constructor(){
        const databasePath = new URL('../database-file/db.json', import.meta.url);
        fs.readFile(databasePath, 'utf-8')
            .then(data => {
                this.#database = JSON.parse(data);
            })
            .catch(() => {
                this.#persist();
            });
    }

    select(table, search){
        let data = this.#database[table] ?? []
        if(search){
            data = data.filter(
                row => {
                    return Object.entries(search).some(
                        ([key, value]) => {
                            return value ? row[key]?.toString()?.toLowerCase()?.includes(value?.toString()?.toLowerCase()) : true;
                        }
                    );
                }
            );
        }
        return data;
    }
        
    insert(table, data){
        if(Array.isArray(this.#database[table])){
            this.#database[table].push(data);
        }
        else{
            this.#database[table] = [data];
        }
        this.#persist();
        return data;
    }
    
    delete(table, id){
        const rowIndex = this.#database[table].findIndex(row => row.id === id);
        if(rowIndex > -1){
            this.#database[table].splice(rowIndex, 1);
            this.#persist();
        }
    }

    update(table, id, data){
        const rowIndex = this.#database[table].findIndex(row => row.id === id);
        if(rowIndex > -1){
            this.#database[table][rowIndex] = {id, ...data};
            this.#persist();
        }
    }

    #persist(){
        const databasePath = new URL('../database-file/db.json', import.meta.url);
        fs.writeFile(databasePath, JSON.stringify(this.#database));
    }
}