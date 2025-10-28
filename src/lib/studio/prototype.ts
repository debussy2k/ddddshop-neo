export const sample = {
    "assets": [
        {
            "id": "1000",
            "type": "component",
            "props": {
                "name": "variant 1",
                "color": "red",
                "bg": "white"
            },
            "variants": [
                {
                    "id": "1200",
                    "name": "variant 2",
                    "delta": {
                        "color": "blue"
                    },
                    "stateVariants": [
                        {
                            "state": "hover",
                            "id": "1210",
                            "name": "variant 2.1",
                            "delta": {
                                "bg": "gray"
                            }
                        }
                    ]
                },
                {
                    "id": "1400",
                    "name": "variant 3",
                    "delta": {
                        "bg": "green"
                    }
                }
            ],
            "children": []
        }
    ],
    "instances": [
        {
            "id": "9000",
            "label": "버튼이다",
            "componentId": "1000",
            "variantId": "1200",
            "overrides": {
                "label": "Buy now",
                "padding": 10
            }
        }
    ]
}


export const section = {
    "id": "1000",
    "type": "section",
    "name": "section 1",
    "props": { // Desktop
        layout: "block",
        justifyContent: "start",
        alignItems: "start",
        gap: 10,
        verticalGap: 10,
        wrap: false,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
    },
    "breakpoints": {
        tablet: {
            justifyContent: "center",
            gap: 25,
        },
        mobile: {
            justifyContent: "end",
            gap: 25,
        }
    },
    "children": [
        {
            pareintId: "2000",
            id: "",
            type: "sandbox",
            label: "Sandbox 1",
            props: {
                color: "red"
            },
            breakpoints: {
                tablet: {},
                mobile: {},
            }
        },
        {
            pareintId: "2000",
            id: "",
            type: "component",
            componentId: "1000",
            variantId: "1200",
            props: {
                // sandbox에 준한 props임. BaseWidgetProp 정보 정도. component 내부 값 조정은 불가.
            },
            breakpoints: {
                tablet: {   // instance override임
                    color: "pink"
                },
                mobile: {},
            }
        }
    ]
};
