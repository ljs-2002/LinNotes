import { defineStore } from 'pinia'
import store from 'store2'

const useNoteStore = defineStore('noteStore', {
    state() {
        return {
            notes: new Map(),
            // notes: globalNotes,
            store_key: 'noteStoreLocal'
        }
    },

    actions: {
        add(key, title, content) {
            let note = {
                'title': title,
                'content': content,
                'id': key
            }
            this.notes.set(key, note)
            store.set(this.store_key, this.transformJson())
            // console.log(key,note)
        },
        update(key, title, content) {
            let note = {
                'title': title,
                'content': content,
                'id': key
            }
            this.notes.set(key, note)
            console.log(this.notes)
            store.set(this.store_key, this.transformJson())
            // console.log(key, note)
        },
        delete(key) {
            this.notes.delete(key)
            store.set(this.store_key, this.transformJson())
        },
        deleteAll() {
            this.notes.clear()
            store.set(this.store_key, "[]")
        },
        load() {
            let notes = store.get(this.store_key) || "[]"
            //json字符串转map
            let arr = JSON.parse(notes);
            console.log(arr)
            for (let i = 0; i < arr.length; i++) {
                this.notes.set(arr[i][0], arr[i][1], arr[i][2])
            }
        },
        getNotes(key) {
            return this.notes.get(key)
        },
        getAllNotes() {
            //以key:value的形式返回所有的notes
            return Array.from(this.notes.entries())
        },
        transformJson() {
            return JSON.stringify(Array.from(this.notes.entries()))
        }
    }
})

export default useNoteStore