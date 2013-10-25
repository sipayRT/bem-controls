({
    mustDeps: [
        { elems: [ 'radio', 'control', 'text' ] },
        { block: 'jquery', elems: 'leftclick' },
        { block: 'i-bem', elem: 'dom' },
        { block : 'radiobox' }
    ],
    shouldDeps: [
        'next-tick'
    ]
})
