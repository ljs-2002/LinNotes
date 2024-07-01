import { defineStore } from 'pinia'
import store from 'store2'
import _ from "lodash";

const useNoteStore = defineStore('noteStore', {
    state() {
        return {
            notes: new Map(),
            notes_list: [],//存储所有的notes的Title和CreateTime
            store_key: 'noteStoreLocal'
        }
    },

    actions: {
        add(key, title, create_time, content) {
            let note = {
                'title': title,
                'create_time': create_time,
                'content': content,
                'id': key,
            }
            this.notes.set(key, note)
            //更新notes_list
            this.notes_list.push({ 'noteTitle': title, 'createTime': create_time , 'id': key})
            store.set(this.store_key, this.transformJson())
            // console.log(key,note)
        },
        update(key, title, create_time, content) {
            let note = {
                'title': title,
                'create_time': create_time,
                'content': content,
                'id': key,
            }
            this.notes.set(key, note)
            //更新notes_list
            _.find(this.notes_list, function (o) { return o.id === key }).noteTitle = title
            store.set(this.store_key, this.transformJson())
            // console.log(key, note)
        },
        delete(key) {
            this.notes.delete(key)
            //更新notes_list
            _.remove(this.notes_list, function (o) { return o.id === key })
            store.set(this.store_key, this.transformJson())
            store.remove(`vditor-${key}`)
        },
        deleteAll() {
            this.notes.clear()
            this.notes_list = []
            store.set(this.store_key, "[]")
            if(process.env.NODE_ENV === 'development'){
                store.clearAll()
            }
            // store.clearAll()
        },
        load() {
            let to_load = store.get(this.store_key)
            if (to_load === undefined || to_load === null || to_load === "[]" || to_load ===[]) {
                to_load = '{"notes":[],"notes_list":[]}'
            }
            let {notes, notes_list} = JSON.parse(to_load)
            // //json字符串转map
            // let arr = JSON.parse(notes);
            for (let i = 0; i < notes.length; i++) {
                this.notes.set(notes[i][0], notes[i][1], notes[i][2])
            }
            this.notes_list = notes_list
        },
        getNotes(key) {
            if (this.notes.has(key)) {
                return this.notes.get(key)
            } else {
                return null
            }
        },
        getAllNotes() {
            //以key:value的形式返回所有的notes
            return Array.from(this.notes.entries())
        },
        transformJson() {
            const to_store = {
                'notes': Array.from(this.notes.entries()),
                'notes_list': this.notes_list
            }
            return JSON.stringify(to_store)
        },
    }
})

export default useNoteStore