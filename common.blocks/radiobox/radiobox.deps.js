({
    mustDeps: [
        { block: 'jquery', elems: 'leftclick' },
        { block: 'i-bem', elems: ['dom'] }
    ],
    shouldDeps: [
        'next-tick',
        {
            mods: {
                'theme': 'normal',
                'disabled': 'yes',
                'focused': 'yes',
                'hovered': 'yes'
            }
        },
        { elems: [ 'radio', 'box', 'control' ] }
    ]
})
