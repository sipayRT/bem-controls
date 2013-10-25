({
    mustDeps: [
        { block: 'jquery', elems: 'leftclick' },
        { block: 'i-bem', elems: ['dom'] }
    ],
    shouldDeps: [
        'next-tick',
        {
            elems: [ 'text' ],
            mods: {
                'focused': 'yes',
                'hovered': 'yes',
                'disabled': 'yes', /* CHECKME: remove disabled from default dependencies? */
                'pressed': 'yes'
            }
        }
    ]
})
