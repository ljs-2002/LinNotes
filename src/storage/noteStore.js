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
            _.find(this.notes_list, function (o) { return o.id === key }).title = title
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
        },
        updateList(){
            this.notes_list = []
            for (let [key, value] of this.notes) {
                this.notes_list.push({ 'title': value.title, 'create_time': value.create_time })
            }
        }
    }
})

export default useNoteStore