# Overview 

This is the Coursely application where user log in and have a conversation with an ai chatbot which at the end recommends executive education courses and programs. 

# Features 
- Using NextJs App router, Next 14, Typescript, Clerk, Supabase
- The user logs in their email or google account (via Clerk). 
- Then brings them to a chatbot that asks questions about the users executive background. 
- At the end of the questions, a button shows to see recommended courses. 
- Then the user is brought to a dashboard with their recommended courses and a catalog of the remaining courses. 
- You can mock create the questions and courses information. 
- Information is stored in tables on Supabase (schemas not defined yet) 
- When creating the api routes, if the resources are not available, you can mock responses

# Project structure

.
├── .next
├── node_modules
├── requirements
├── src
│   └── app
│       ├── fonts
│       ├── favicon.ico
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
├── middleware.ts
├── .env.local
├── .gitignore
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json


# Rules 
- Create a new page by creating a new folder inside /app. Then create a new page.tsx file inside the new folder (You can also add a layout.tsx)
- Custome components should go into /app/components
- Create api route by creating a route at app/api/users/route.js

# Documentation 

## Supabase

Initializing```
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key')

```

Generating TypeScript Types
```
supabase gen types typescript --project-id abcdefghijklmnopqrst > database.types.ts
```
```
create table public.movies (
  id bigint generated always as identity primary key,
  name text not null,
  data jsonb null
);
```
```
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      movies: {
        Row: {               // the data expected from .select()
          id: number
          name: string
          data: Json | null
        }
        Insert: {            // the data to be passed to .insert()
          id?: never         // generated columns must not be supplied
          name: string       // `not null` columns with no default must be supplied
          data?: Json | null // nullable columns can be omitted
        }
        Update: {            // the data to be passed to .update()
          id?: never
          name?: string      // `not null` columns are optional on .update()
          data?: Json | null
        }
      }
    }
  }
}
```
```
import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabase = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)
```

Fetch data
Perform a SELECT query on the table or view.

By default, Supabase projects return a maximum of 1,000 rows. This setting can be changed in your project's API settings. It's recommended that you keep it low to limit the payload size of accidental or malicious requests. You can use range() queries to paginate through your data.
select() can be combined with Filters
select() can be combined with Modifiers
apikey is a reserved keyword if you're using the Supabase Platform and should be avoided as a column name.
Parameters
columns
Optional
Query
The columns to retrieve, separated by commas. Columns can be renamed when returned with customName:columnName

```
const { data, error } = await supabase
  .from('countries')
  .select()

```

Insert data
Perform an INSERT into the table or view.

Parameters
values
Required
Union: expand to see options
The values to insert. Pass an object to insert a single row or an array to insert multiple rows.

Details

```
const { error } = await supabase
  .from('countries')
  .insert({ id: 1, name: 'Denmark' })

const { data, error } = await supabase
  .from('countries')
  .insert({ id: 1, name: 'Denmark' })
  .select()

const { error } = await supabase
  .from('countries')
  .insert([
    { id: 1, name: 'Nepal' },
    { id: 1, name: 'Vietnam' },
  ])

```

Update data
Perform an UPDATE on the table or view.

update() should always be combined with Filters to target the item(s) you wish to update.
Parameters
values
Required
Row
The values to update with

```
const { error } = await supabase
  .from('countries')
  .update({ name: 'Australia' })
  .eq('id', 1)

const { data, error } = await supabase
  .from('countries')
  .update({ name: 'Australia' })
  .eq('id', 1)
  .select()

const { data, error } = await supabase
  .from('users')
  .update({
    address: {
      street: 'Melrose Place',
      postcode: 90210
    }
  })
  .eq('address->postcode', 90210)
  .select()

```

Upsert data
Perform an UPSERT on the table or view. Depending on the column(s) passed to onConflict, .upsert() allows you to perform the equivalent of .insert() if a row with the corresponding onConflict columns doesn't exist, or if it does exist, perform an alternative action depending on ignoreDuplicates.

Primary keys must be included in values to use upsert.
Parameters
values
Required
Union: expand to see options
The values to upsert with. Pass an object to upsert a single row or an array to upsert multiple rows.

Details
```
const { data, error } = await supabase
  .from('countries')
  .upsert({ id: 1, name: 'Albania' })
  .select()

Delete data
Perform a DELETE on the table or view.

delete() should always be combined with filters to target the item(s) you wish to delete.
If you use delete() with filters and you have RLS enabled, only rows visible through SELECT policies are deleted. Note that by default no rows are visible, so you need at least one SELECT/ALL policy that makes the rows visible.
When using delete().in(), specify an array of values to target multiple rows with a single query. This is particularly useful for batch deleting entries that share common criteria, such as deleting users by their IDs. Ensure that the array you provide accurately represents all records you intend to delete to avoid unintended data removal.

```
const response = await supabase
  .from('countries')
  .delete()
  .eq('id', 1)

const { data, error } = await supabase
  .from('countries')
  .delete()
  .eq('id', 1)
  .select()

const response = await supabase
  .from('countries')
  .delete()
  .in('id', [1, 2, 3])

```


