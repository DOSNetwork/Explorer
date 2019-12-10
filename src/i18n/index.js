import zh from './zh-CN';
import en from './en-US'

const Message = {
    zh,
    en
}

export function Locale(locale = 'en-US') {
    let lang = locale === 'zh-CN' ? 'zh' : 'en'
    return Message[lang]
}
