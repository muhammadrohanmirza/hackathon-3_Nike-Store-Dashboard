import { title } from "process";

export default {
    name: 'order',
    title: 'Order',
    type: 'document',
    fields: [
        {
            name: 'firstName',
            title: 'First Number',
            type: 'string',
        },
        {
            name: 'lastName',
            title: 'Last Number',
            type: 'string',
        },
        {
            name: 'address',
            title: 'Address',
            type: 'string',
        },
        {
            name: 'city',
            title: 'City',
            type: 'string',
        },
        {
            name: 'zipcode',
            title:'Zip code',
            type:'string'
        },
        {
            name:'phone',
            title:'Phone',
            type:'string'
        },
        {
            name:'email',
            title:'Email',
            type:'string'
        },
        {
            name: 'cartitems',
            title: 'Cart Items',
            type: 'array',
            of: [{ type: 'reference', to  :{ type:'product'} }],
        },
        {
            name: 'inventory',
            title: 'Inventory',
            type: 'number',
          },
        {
            name: 'total',
            title: 'Total',
            type: 'number',
        },
        {
            name: "discount",
            title: "Discount",
            type: "number",

        },
        {
            name: "status",
            title: "Order Status",
            type: "string",
            options: {
                list: [
                    {title: 'All', value: 'all'},
                    { title: 'Pending', value: 'pending' },
                    { title: 'Success', value: 'success' },
                    { title: 'Dispatch', value: 'dispatch' },
                ],
                layout: 'radio'
            },
            initialValue: 'All'
        },
    ],
}