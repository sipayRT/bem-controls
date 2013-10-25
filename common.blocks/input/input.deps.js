({
    mustDeps: [
        { block: 'jquery', elems: 'leftclick' },
        { block: 'i-bem', elems: ['dom'] }
    ],
    shouldDeps: [
        'next-tick',
        'tick',
        'idle',
        { mods: { disabled: 'yes', focused: 'yes' } },
        { elems: [ 'box', 'control' ] },
        {
            elem: 'clear',
            mods: {
                'visibility': 'visible'
            }
        }
    ]
})