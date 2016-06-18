// Ramda is available through R
var f = flyd
// var m, R
var renderAll = () => m.render(document.getElementById('root'), m(ContactsWidget))
var contacts = f.stream([])
var newContact = () => {
  return { id: f.stream(false), name: f.stream(''), email: f.stream('') }
}

var ContactsWidget = {
  oninit: vnode => {
    vnode.state.currentContact = newContact()
  },
  view: vnode => {
    return m('div',
             m(ContactForm, {
               contact: vnode.state.currentContact,
               onSave: (() => {
                 var nextId = 1
                 return (c) => {
                   vnode.state.currentContact = newContact()
                   if (!c.id()) c.id(nextId++)
                   if (R.none((a) => {
                     return a === c
                   }, contacts())) {
                     contacts(contacts().concat(c))
                   } else {
                     renderAll()
                   }
                 }
               })()
             }),
             m(ContactList, {
               contacts: contacts,
               onEdit: (c) => {
                 vnode.state.currentContact = c
                 renderAll()
               },
               onDelete: (c) => contacts(R.filter((a) => {
                 return a.id() !== c.id()
               }, contacts()))
             })
            )
  }
}

var ContactForm = {
  oninit: (vnode) => {
    vnode.state.onSave = vnode.attrs.onSave
  },
  view: vnode => {
    var contact = vnode.attrs.contact
    var onSave = vnode.state.onSave

    return m('form',
             m('label', 'Name: '),
             m('input', { oninput: m.withAttr('value', contact.name), value: contact.name() }),
             m('label', 'Email: '),
             m('input', { oninput: m.withAttr('value', contact.email), value: contact.email() }),
             m('button[type=button]', { onclick: onSave.bind(this, contact) }, 'Save')
            )
  }
}

var ContactList = {
  view: vnode => {
    return m('table',
             vnode.attrs.contacts().map(contact => {
               return m('tr',
                        m('td', contact.id()),
                        m('td', contact.name()),
                        m('td', contact.email()),
                        m('td',
                          m('button', { onclick: vnode.attrs.onEdit.bind(this, contact) }, 'Edit'),
                          m('button', { onclick: vnode.attrs.onDelete.bind(this, contact) }, 'Delete')
                         )
                       )
             })
            )
  }
}

f.on(() => {
  renderAll()
}, contacts)
