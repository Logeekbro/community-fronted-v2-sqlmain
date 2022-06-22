import store from "@/store"

const headers = {
    userToken: store.getters.token
  }

const vditorConfig = {
    height: 500,
    placeholder: '输入文章内容……',
    theme: 'classic',
    counter: {
        enable: true,
        type: 'markdown'
    },
    mode: 'wysiwyg',
    toolbar: [
        // "emoji",  表情
        "headings",
        "bold",
        "italic",
        "strike",
        "link",
        "|",
        "list",
        "ordered-list",
        // "check",
        "outdent",
        "indent",
        "|",
        "quote",
        "line",
        "code",
        "inline-code",
        "insert-before",
        "insert-after",
        "|",
        // "upload",默认上传
        { //自定义上传
            hotkey: "",
            name: "upload",
            // tipPosition: "s",
            tip: "上传图片",
            className: "right",
        },
        // "record",
        "table",
        "|",
        "undo",
        "redo",
        "|",
        "fullscreen",
        "edit-mode",
        {
            name: "more",
            toolbar: [
                "both",
                // "code-theme",
                // "content-theme",
                "export",
                "outline",
                "preview",
                // "devtools",
                // "info",
                // "help",
            ],
        }
        // ,"|",
        // {
        //   hotkey: "⌘-S",
        //   name: "save",
        //   tipPosition: "s",
        //   tip: "保存",
        //   className: "right",
        //   icon: `<img style="height: 16px" src='https://img.58cdn.com.cn/escstatic/docs/imgUpload/idocs/save.svg'/>`,
        //   click() {
        //     that.saveDoc();
        //   }
        // },
    ],
    preview: {
        delay: 0,
        hljs: {
            style: 'monokai',
            lineNumber: true
        }
    },
    tab: '\t',
    toolbarConfig: {
        pin: true
    },
    cache: {
        enable: false
    },
    upload: {
        url: process.env.VUE_APP_SERVER_URL + "/upload/article/img",
        accept: 'image/jpg, image/jpeg, image/png',
        max: 5 * 1024 * 1024,
        headers: headers,
        multiple: true,
        fieldName: "files",
        // success: (editor, msg) => {
        //   const data = JSON.parse(msg)
        //   if (data.code !== 200) {
        //     this.contentEditor.tip(data.message, 2000)
        //   }
        // }
    }
}

export default vditorConfig