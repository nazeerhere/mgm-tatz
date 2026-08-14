# Client Website A — Content Model

## Design rules

- PostgreSQL UUID primary keys and timezone-aware timestamps.
- Store media outside relational rows.
- Style taxonomy is data-driven and many-to-many.
- Public queries return published records only.
- Avoid generalized page-builder/block schemas in the first version.

## Proposed tables

### `portfolio_items`

| Field            | Proposed type | Rule                                                |
| ---------------- | ------------- | --------------------------------------------------- |
| `id`             | `uuid`        | Primary key                                         |
| `title`          | `text`        | Required, bounded length                            |
| `slug`           | `text`        | Unique; optional for the first gallery-only slice   |
| `type`           | enum/check    | `tattoo`, `drawing`, `flash`, `concept`             |
| `description`    | `text`        | Required short editorial description in first slice |
| `body_placement` | `text`        | Nullable; meaningful mainly for tattoos             |
| `featured`       | `boolean`     | Default false                                       |
| `available`      | `boolean`     | Default false; most relevant to flash/concepts      |
| `published`      | `boolean`     | Default false                                       |
| `display_order`  | `integer`     | Default 0; stable secondary sort by creation time   |
| `created_at`     | `timestamptz` | Database-generated                                  |
| `updated_at`     | `timestamptz` | Trigger/application maintained                      |

### `portfolio_media`

| Field               | Proposed type | Rule                                           |
| ------------------- | ------------- | ---------------------------------------------- |
| `id`                | `uuid`        | Primary key                                    |
| `portfolio_item_id` | `uuid`        | Foreign key, cascade delete                    |
| `storage_bucket`    | `text`        | Required                                       |
| `storage_key`       | `text`        | Unique, required                               |
| `alt_text`          | `text`        | Required for meaningful images                 |
| `mime_type`         | `text`        | Validated allowlist                            |
| `width` / `height`  | `integer`     | Positive when known                            |
| `is_primary`        | `boolean`     | Exactly one primary image per publishable item |
| `display_order`     | `integer`     | Default 0                                      |
| `created_at`        | `timestamptz` | Database-generated                             |

### `style_tags`

`id`, unique `name`, unique normalized `slug`, and timestamps. Seed suggestions may include Black & Grey, Illustrative, Anime / Manga, Dark Fantasy, Mythic, Classical, Realism, Animals, and Symbolic, but none are permanent code-level categories.

### `portfolio_item_style_tags`

Composite primary key across `portfolio_item_id` and `style_tag_id`, with cascading foreign keys.

### `site_content`

One client-specific row or bounded key/value records for artist name, handle, headline, short/long biography, location, studio information, social links, and consultation CTA. Exact shape awaits approved source content and is not part of the first vertical slice.

### `faqs`

`id`, `question`, `answer`, `display_order`, `published`, and timestamps. Deferred from the first vertical slice.

## Publish invariant

An item may be published only when it has a valid title, type, description, exactly one accessible primary image, and any type-specific required metadata established during implementation. Public reads must independently require `published = true`; hiding an unpublished item only in UI code is insufficient.

## Deferred schema decisions

- Whether slugs are required before a detail route exists.
- Whether availability needs status values rather than a boolean.
- Whether social links are normalized or stored as constrained JSON.

## Implemented first-slice decisions

- Slugs remain deferred because no detail route exists.
- Availability remains a boolean for this bounded slice.
- Draft media uses a private bucket and is promoted by server-controlled copy to a public bucket at publish time.
- `owner_users` is a database allowlist used by RLS; the application independently checks `OWNER_USER_ID`.
