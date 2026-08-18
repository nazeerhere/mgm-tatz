# Client Website A — Content Model

## Gallery pages

Pagination is presentation state only. It creates no persisted page records and does not alter publication, Gallery membership, metadata, filter tags, or ordering fields.

## Footer contact configuration

Instagram, TikTok, and public contact email are optional deployment configuration, not database content. Missing values remain explicitly unavailable in the UI; no artist handle or address is inferred.

## Homepage slot editing

The compact admin picker is only a view over published canonical portfolio records. It creates no entity: Hero continues to use `featured`/`homepage_order`, while Drawings uses `drawing_featured`/`homepage_drawing_order`.

## Homepage drawing slots

Canonical `portfolio_items` rows optionally own a separate drawing placement:

- `drawing_featured`: whether the item occupies a drawing slot
- `homepage_drawing_order`: nullable slot constrained to 1–4

The pair follows the existing hero placement invariant. Media remains canonical, and hero/Gallery fields remain independent.

## Managed FAQ

`public.faqs` owns one durable FAQ entry per row:

- `id`: UUID primary key
- `question`: 5–200 characters
- `answer`: 5–2,000 characters
- `display_order`: integer from 0–10,000
- `is_active`: public visibility flag
- `created_at`, `updated_at`: server timestamps

Only active rows are publicly readable. The owner can create, edit, reorder by changing `display_order`, hide/show, and explicitly confirm deletion. Checked-in `content/site-content.ts` FAQ entries remain a temporary read fallback, not a second writable store.

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
