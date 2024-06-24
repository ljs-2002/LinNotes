import { transform } from 'lodash'
import { defineStore } from 'pinia'
import store from 'store2'

const useNoteStore = defineStore('noteStore', {
    state: () => {
        return {
            notes: new Map()
        }
    },

    actions: {
        add(key, title, content) {
            let note = {
                'title': title,
                'content': content
            }
            this.notes.set(key, note)
            store.set(key, this.transformJson())
            // console.log(key,note)
        },
        update(key, title, content) {
            let note = {
                'title': title,
                'content': content
            }
            this.notes.set(key, note)
            console.log(this.notes)
            store.set(key, this.transformJson())
            // console.log(key, note)
        },
        transformJson() {
            return JSON.stringify(Array.from(this.notes.entries()))
        }
    }
})

export default useNoteStore