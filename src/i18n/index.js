import messages from './translation'

function ExtractLocale(locale) {
    let lang = locale === 'en' ? 'en-US' : 'zh-CN'
    let targetMessages = {}
    for (let id in messages) {
        targetMessages[id] = messages[id][lang]
    }
    return targetMessages
}

export default ExtractLocale;
