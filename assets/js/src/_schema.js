var WPIAB_SCHEMA = {
    "_links": {
        "up": [
            {
                "href": "http://local.ucc.edu/wp-json/"
            }
        ]
    },
    "namespace": "wp/v2",
    "routes": {
        "/wp/v2": {
            "namespace": "wp/v2",
            "methods": [
                "GET"
            ],
            "endpoints": [
                {
                    "methods": [
                        "GET"
                    ],
                    "args": {
                        "namespace": {
                            "required": false,
                            "default": "wp/v2"
                        },
                        "context": {
                            "required": false,
                            "default": "view"
                        }
                    }
                }
            ],
            "_links": {
                "self": "http://local.ucc.edu/wp-json/wp/v2"
            }
        },
        "/wp/v2/pages": {
            "namespace": "wp/v2",
            "methods": [
                "GET",
                "POST",
                "GET",
                "POST"
            ],
            "endpoints": [
                {
                    "methods": [
                        "GET"
                    ],
                    "args": {
                        "context": {
                            "required": false,
                            "default": "view",
                            "enum": [
                                "view",
                                "embed",
                                "edit"
                            ],
                            "description": "Scope under which the request is made; determines fields present in response.",
                            "type": "string"
                        },
                        "page": {
                            "required": false,
                            "default": 1,
                            "description": "Current page of the collection.",
                            "type": "integer"
                        },
                        "per_page": {
                            "required": false,
                            "default": 10,
                            "description": "Maximum number of items to be returned in result set.",
                            "type": "integer"
                        },
                        "search": {
                            "required": false,
                            "description": "Limit results to those matching a string.",
                            "type": "string"
                        },
                        "after": {
                            "required": false,
                            "description": "Limit response to posts published after a given ISO8601 compliant date.",
                            "type": "string"
                        },
                        "author": {
                            "required": false,
                            "default": [],
                            "description": "Limit result set to posts assigned to specific authors.",
                            "type": "array",
                            "items": {
                                "type": "integer"
                            }
                        },
                        "author_exclude": {
                            "required": false,
                            "default": [],
                            "description": "Ensure result set excludes posts assigned to specific authors.",
                            "type": "array",
                            "items": {
                                "type": "integer"
                            }
                        },
                        "before": {
                            "required": false,
                            "description": "Limit response to posts published before a given ISO8601 compliant date.",
                            "type": "string"
                        },
                        "exclude": {
                            "required": false,
                            "default": [],
                            "description": "Ensure result set excludes specific IDs.",
                            "type": "array",
                            "items": {
                                "type": "integer"
                            }
                        },
                        "include": {
                            "required": false,
                            "default": [],
                            "description": "Limit result set to specific IDs.",
                            "type": "array",
                            "items": {
                                "type": "integer"
                            }
                        },
                        "menu_order": {
                            "required": false,
                            "description": "Limit result set to posts with a specific menu_order value.",
                            "type": "integer"
                        },
                        "offset": {
                            "required": false,
                            "description": "Offset the result set by a specific number of items.",
                            "type": "integer"
                        },
                        "order": {
                            "required": false,
                            "default": "desc",
                            "enum": [
                                "asc",
                                "desc"
                            ],
                            "description": "Order sort attribute ascending or descending.",
                            "type": "string"
                        },
                        "orderby": {
                            "required": false,
                            "default": "date",
                            "enum": [
                                "date",
                                "relevance",
                                "id",
                                "include",
                                "title",
                                "slug",
                                "menu_order"
                            ],
                            "description": "Sort collection by object attribute.",
                            "type": "string"
                        },
                        "parent": {
                            "required": false,
                            "default": [],
                            "description": "Limit result set to those of particular parent IDs.",
                            "type": "array",
                            "items": {
                                "type": "integer"
                            }
                        },
                        "parent_exclude": {
                            "required": false,
                            "default": [],
                            "description": "Limit result set to all items except those of a particular parent ID.",
                            "type": "array",
                            "items": {
                                "type": "integer"
                            }
                        },
                        "slug": {
                            "required": false,
                            "description": "Limit result set to posts with one or more specific slugs.",
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "status": {
                            "required": false,
                            "default": "publish",
                            "description": "Limit result set to posts assigned one or more statuses.",
                            "type": "array",
                            "items": {
                                "enum": [
                                    "publish",
                                    "future",
                                    "draft",
                                    "pending",
                                    "private",
                                    "trash",
                                    "auto-draft",
                                    "inherit",
                                    "acf-disabled",
                                    "tribe-ea-success",
                                    "tribe-ea-failed",
                                    "tribe-ea-schedule",
                                    "tribe-ea-pending",
                                    "tribe-ea-draft",
                                    "tribe-ignored",
                                    "any"
                                ],
                                "type": "string"
                            }
                        }
                    }
                },
                {
                    "methods": [
                        "POST"
                    ],
                    "args": {
                        "date": {
                            "required": false,
                            "description": "The date the object was published, in the site's timezone.",
                            "type": "string"
                        },
                        "date_gmt": {
                            "required": false,
                            "description": "The date the object was published, as GMT.",
                            "type": "string"
                        },
                        "slug": {
                            "required": false,
                            "description": "An alphanumeric identifier for the object unique to its type.",
                            "type": "string"
                        },
                        "status": {
                            "required": false,
                            "enum": [
                                "publish",
                                "future",
                                "draft",
                                "pending",
                                "private",
                                "acf-disabled",
                                "tribe-ea-success",
                                "tribe-ea-failed",
                                "tribe-ea-schedule",
                                "tribe-ea-pending",
                                "tribe-ea-draft",
                                "tribe-ignored"
                            ],
                            "description": "A named status for the object.",
                            "type": "string"
                        },
                        "password": {
                            "required": false,
                            "description": "A password to protect access to the content and excerpt.",
                            "type": "string"
                        },
                        "parent": {
                            "required": false,
                            "description": "The ID for the parent of the object.",
                            "type": "integer"
                        },
                        "title": {
                            "required": false,
                            "description": "The title for the object.",
                            "type": "object"
                        },
                        "content": {
                            "required": false,
                            "description": "The content for the object.",
                            "type": "object"
                        },
                        "author": {
                            "required": false,
                            "description": "The ID for the author of the object.",
                            "type": "integer"
                        },
                        "excerpt": {
                            "required": false,
                            "description": "The excerpt for the object.",
                            "type": "object"
                        },
                        "featured_media": {
                            "required": false,
                            "description": "The ID of the featured media for the object.",
                            "type": "integer"
                        },
                        "comment_status": {
                            "required": false,
                            "enum": [
                                "open",
                                "closed"
                            ],
                            "description": "Whether or not comments are open on the object.",
                            "type": "string"
                        },
                        "ping_status": {
                            "required": false,
                            "enum": [
                                "open",
                                "closed"
                            ],
                            "description": "Whether or not the object can be pinged.",
                            "type": "string"
                        },
                        "menu_order": {
                            "required": false,
                            "description": "The order of the object in relation to other object of its type.",
                            "type": "integer"
                        },
                        "meta": {
                            "required": false,
                            "description": "Meta fields.",
                            "type": "object"
                        },
                        "template": {
                            "required": false,
                            "enum": [
                                "page-templates/1-column.php",
                                "page-templates/2-column.php",
                                "page-templates/3-column.php",
                                "page-templates/landing-page.php",
                                ""
                            ],
                            "description": "The theme file to use to display the object.",
                            "type": "string"
                        }
                    }
                },
                {
                    "methods": [
                        "GET"
                    ],
                    "args": {
                        "context": {
                            "required": false,
                            "default": "view",
                            "enum": [
                                "view",
                                "embed",
                                "edit"
                            ],
                            "description": "Scope under which the request is made; determines fields present in response.",
                            "type": "string"
                        },
                        "page": {
                            "required": false,
                            "default": 1,
                            "description": "Current page of the collection.",
                            "type": "integer"
                        },
                        "per_page": {
                            "required": false,
                            "default": 10,
                            "description": "Maximum number of items to be returned in result set.",
                            "type": "integer"
                        },
                        "search": {
                            "required": false,
                            "description": "Limit results to those matching a string.",
                            "type": "string"
                        },
                        "after": {
                            "required": false,
                            "description": "Limit response to posts published after a given ISO8601 compliant date.",
                            "type": "string"
                        },
                        "author": {
                            "required": false,
                            "default": [],
                            "description": "Limit result set to posts assigned to specific authors.",
                            "type": "array",
                            "items": {
                                "type": "integer"
                            }
                        },
                        "author_exclude": {
                            "required": false,
                            "default": [],
                            "description": "Ensure result set excludes posts assigned to specific authors.",
                            "type": "array",
                            "items": {
                                "type": "integer"
                            }
                        },
                        "before": {
                            "required": false,
                            "description": "Limit response to posts published before a given ISO8601 compliant date.",
                            "type": "string"
                        },
                        "exclude": {
                            "required": false,
                            "default": [],
                            "description": "Ensure result set excludes specific IDs.",
                            "type": "array",
                            "items": {
                                "type": "integer"
                            }
                        },
                        "include": {
                            "required": false,
                            "default": [],
                            "description": "Limit result set to specific IDs.",
                            "type": "array",
                            "items": {
                                "type": "integer"
                            }
                        },
                        "menu_order": {
                            "required": false,
                            "description": "Limit result set to posts with a specific menu_order value.",
                            "type": "integer"
                        },
                        "offset": {
                            "required": false,
                            "description": "Offset the result set by a specific number of items.",
                            "type": "integer"
                        },
                        "order": {
                            "required": false,
                            "default": "desc",
                            "enum": [
                                "asc",
                                "desc"
                            ],
                            "description": "Order sort attribute ascending or descending.",
                            "type": "string"
                        },
                        "orderby": {
                            "required": false,
                            "default": "date",
                            "enum": [
                                "date",
                                "relevance",
                                "id",
                                "include",
                                "title",
                                "slug",
                                "menu_order"
                            ],
                            "description": "Sort collection by object attribute.",
                            "type": "string"
                        },
                        "parent": {
                            "required": false,
                            "default": [],
                            "description": "Limit result set to those of particular parent IDs.",
                            "type": "array",
                            "items": {
                                "type": "integer"
                            }
                        },
                        "parent_exclude": {
                            "required": false,
                            "default": [],
                            "description": "Limit result set to all items except those of a particular parent ID.",
                            "type": "array",
                            "items": {
                                "type": "integer"
                            }
                        },
                        "slug": {
                            "required": false,
                            "description": "Limit result set to posts with one or more specific slugs.",
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "status": {
                            "required": false,
                            "default": "publish",
                            "description": "Limit result set to posts assigned one or more statuses.",
                            "type": "array",
                            "items": {
                                "enum": [
                                    "publish",
                                    "future",
                                    "draft",
                                    "pending",
                                    "private",
                                    "trash",
                                    "auto-draft",
                                    "inherit",
                                    "acf-disabled",
                                    "tribe-ea-success",
                                    "tribe-ea-failed",
                                    "tribe-ea-schedule",
                                    "tribe-ea-pending",
                                    "tribe-ea-draft",
                                    "tribe-ignored",
                                    "any"
                                ],
                                "type": "string"
                            }
                        }
                    }
                },
                {
                    "methods": [
                        "POST"
                    ],
                    "args": {
                        "date": {
                            "required": false,
                            "description": "The date the object was published, in the site's timezone.",
                            "type": "string"
                        },
                        "date_gmt": {
                            "required": false,
                            "description": "The date the object was published, as GMT.",
                            "type": "string"
                        },
                        "slug": {
                            "required": false,
                            "description": "An alphanumeric identifier for the object unique to its type.",
                            "type": "string"
                        },
                        "status": {
                            "required": false,
                            "enum": [
                                "publish",
                                "future",
                                "draft",
                                "pending",
                                "private",
                                "acf-disabled",
                                "tribe-ea-success",
                                "tribe-ea-failed",
                                "tribe-ea-schedule",
                                "tribe-ea-pending",
                                "tribe-ea-draft",
                                "tribe-ignored"
                            ],
                            "description": "A named status for the object.",
                            "type": "string"
                        },
                        "password": {
                            "required": false,
                            "description": "A password to protect access to the content and excerpt.",
                            "type": "string"
                        },
                        "parent": {
                            "required": false,
                            "description": "The ID for the parent of the object.",
                            "type": "integer"
                        },
                        "title": {
                            "required": false,
                            "description": "The title for the object.",
                            "type": "object"
                        },
                        "content": {
                            "required": false,
                            "description": "The content for the object.",
                            "type": "object"
                        },
                        "author": {
                            "required": false,
                            "description": "The ID for the author of the object.",
                            "type": "integer"
                        },
                        "excerpt": {
                            "required": false,
                            "description": "The excerpt for the object.",
                            "type": "object"
                        },
                        "featured_media": {
                            "required": false,
                            "description": "The ID of the featured media for the object.",
                            "type": "integer"
                        },
                        "comment_status": {
                            "required": false,
                            "enum": [
                                "open",
                                "closed"
                            ],
                            "description": "Whether or not comments are open on the object.",
                            "type": "string"
                        },
                        "ping_status": {
                            "required": false,
                            "enum": [
                                "open",
                                "closed"
                            ],
                            "description": "Whether or not the object can be pinged.",
                            "type": "string"
                        },
                        "menu_order": {
                            "required": false,
                            "description": "The order of the object in relation to other object of its type.",
                            "type": "integer"
                        },
                        "meta": {
                            "required": false,
                            "description": "Meta fields.",
                            "type": "object"
                        },
                        "template": {
                            "required": false,
                            "enum": [
                                "page-templates/1-column.php",
                                "page-templates/2-column.php",
                                "page-templates/3-column.php",
                                "page-templates/landing-page.php",
                                ""
                            ],
                            "description": "The theme file to use to display the object.",
                            "type": "string"
                        },
                        "migration_status": {
                            "required": false,
                            "enum": [
                                "new",
                                "in_progress",
                                "in_review",
                                "complete"
                            ],
                            "description": "Migration Status",
                            "type": "string"
                        }
                    }
                }
            ],
            "_links": {
                "self": "http://local.ucc.edu/wp-json/wp/v2/pages"
            }
        },
        "/wp/v2/pages/(?P<id>[\\d]+)": {
            "namespace": "wp/v2",
            "methods": [
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE"
            ],
            "endpoints": [
                {
                    "methods": [
                        "GET"
                    ],
                    "args": {
                        "context": {
                            "required": false,
                            "default": "view",
                            "enum": [
                                "view",
                                "embed",
                                "edit"
                            ],
                            "description": "Scope under which the request is made; determines fields present in response.",
                            "type": "string"
                        },
                        "password": {
                            "required": false,
                            "description": "The password for the post if it is password protected.",
                            "type": "string"
                        }
                    }
                },
                {
                    "methods": [
                        "POST",
                        "PUT",
                        "PATCH"
                    ],
                    "args": {
                        "date": {
                            "required": false,
                            "description": "The date the object was published, in the site's timezone.",
                            "type": "string"
                        },
                        "date_gmt": {
                            "required": false,
                            "description": "The date the object was published, as GMT.",
                            "type": "string"
                        },
                        "slug": {
                            "required": false,
                            "description": "An alphanumeric identifier for the object unique to its type.",
                            "type": "string"
                        },
                        "status": {
                            "required": false,
                            "enum": [
                                "publish",
                                "future",
                                "draft",
                                "pending",
                                "private",
                                "acf-disabled",
                                "tribe-ea-success",
                                "tribe-ea-failed",
                                "tribe-ea-schedule",
                                "tribe-ea-pending",
                                "tribe-ea-draft",
                                "tribe-ignored"
                            ],
                            "description": "A named status for the object.",
                            "type": "string"
                        },
                        "password": {
                            "required": false,
                            "description": "A password to protect access to the content and excerpt.",
                            "type": "string"
                        },
                        "parent": {
                            "required": false,
                            "description": "The ID for the parent of the object.",
                            "type": "integer"
                        },
                        "title": {
                            "required": false,
                            "description": "The title for the object.",
                            "type": "object"
                        },
                        "content": {
                            "required": false,
                            "description": "The content for the object.",
                            "type": "object"
                        },
                        "author": {
                            "required": false,
                            "description": "The ID for the author of the object.",
                            "type": "integer"
                        },
                        "excerpt": {
                            "required": false,
                            "description": "The excerpt for the object.",
                            "type": "object"
                        },
                        "featured_media": {
                            "required": false,
                            "description": "The ID of the featured media for the object.",
                            "type": "integer"
                        },
                        "comment_status": {
                            "required": false,
                            "enum": [
                                "open",
                                "closed"
                            ],
                            "description": "Whether or not comments are open on the object.",
                            "type": "string"
                        },
                        "ping_status": {
                            "required": false,
                            "enum": [
                                "open",
                                "closed"
                            ],
                            "description": "Whether or not the object can be pinged.",
                            "type": "string"
                        },
                        "menu_order": {
                            "required": false,
                            "description": "The order of the object in relation to other object of its type.",
                            "type": "integer"
                        },
                        "meta": {
                            "required": false,
                            "description": "Meta fields.",
                            "type": "object"
                        },
                        "template": {
                            "required": false,
                            "enum": [
                                "page-templates/1-column.php",
                                "page-templates/2-column.php",
                                "page-templates/3-column.php",
                                "page-templates/landing-page.php",
                                ""
                            ],
                            "description": "The theme file to use to display the object.",
                            "type": "string"
                        }
                    }
                },
                {
                    "methods": [
                        "DELETE"
                    ],
                    "args": {
                        "force": {
                            "required": false,
                            "default": false,
                            "description": "Whether to bypass trash and force deletion.",
                            "type": "boolean"
                        }
                    }
                },
                {
                    "methods": [
                        "GET"
                    ],
                    "args": {
                        "context": {
                            "required": false,
                            "default": "view",
                            "enum": [
                                "view",
                                "embed",
                                "edit"
                            ],
                            "description": "Scope under which the request is made; determines fields present in response.",
                            "type": "string"
                        },
                        "password": {
                            "required": false,
                            "description": "The password for the post if it is password protected.",
                            "type": "string"
                        }
                    }
                },
                {
                    "methods": [
                        "POST",
                        "PUT",
                        "PATCH"
                    ],
                    "args": {
                        "date": {
                            "required": false,
                            "description": "The date the object was published, in the site's timezone.",
                            "type": "string"
                        },
                        "date_gmt": {
                            "required": false,
                            "description": "The date the object was published, as GMT.",
                            "type": "string"
                        },
                        "slug": {
                            "required": false,
                            "description": "An alphanumeric identifier for the object unique to its type.",
                            "type": "string"
                        },
                        "status": {
                            "required": false,
                            "enum": [
                                "publish",
                                "future",
                                "draft",
                                "pending",
                                "private",
                                "acf-disabled",
                                "tribe-ea-success",
                                "tribe-ea-failed",
                                "tribe-ea-schedule",
                                "tribe-ea-pending",
                                "tribe-ea-draft",
                                "tribe-ignored"
                            ],
                            "description": "A named status for the object.",
                            "type": "string"
                        },
                        "password": {
                            "required": false,
                            "description": "A password to protect access to the content and excerpt.",
                            "type": "string"
                        },
                        "parent": {
                            "required": false,
                            "description": "The ID for the parent of the object.",
                            "type": "integer"
                        },
                        "title": {
                            "required": false,
                            "description": "The title for the object.",
                            "type": "object"
                        },
                        "content": {
                            "required": false,
                            "description": "The content for the object.",
                            "type": "object"
                        },
                        "author": {
                            "required": false,
                            "description": "The ID for the author of the object.",
                            "type": "integer"
                        },
                        "excerpt": {
                            "required": false,
                            "description": "The excerpt for the object.",
                            "type": "object"
                        },
                        "featured_media": {
                            "required": false,
                            "description": "The ID of the featured media for the object.",
                            "type": "integer"
                        },
                        "comment_status": {
                            "required": false,
                            "enum": [
                                "open",
                                "closed"
                            ],
                            "description": "Whether or not comments are open on the object.",
                            "type": "string"
                        },
                        "ping_status": {
                            "required": false,
                            "enum": [
                                "open",
                                "closed"
                            ],
                            "description": "Whether or not the object can be pinged.",
                            "type": "string"
                        },
                        "menu_order": {
                            "required": false,
                            "description": "The order of the object in relation to other object of its type.",
                            "type": "integer"
                        },
                        "meta": {
                            "required": false,
                            "description": "Meta fields.",
                            "type": "object"
                        },
                        "template": {
                            "required": false,
                            "enum": [
                                "page-templates/1-column.php",
                                "page-templates/2-column.php",
                                "page-templates/3-column.php",
                                "page-templates/landing-page.php",
                                ""
                            ],
                            "description": "The theme file to use to display the object.",
                            "type": "string"
                        },
                        "migration_status": {
                            "required": false,
                            "enum": [
                                "new",
                                "in_progress",
                                "in_review",
                                "complete"
                            ],
                            "description": "Migration Status",
                            "type": "string"
                        }
                    }
                },
                {
                    "methods": [
                        "DELETE"
                    ],
                    "args": {
                        "force": {
                            "required": false,
                            "default": false,
                            "description": "Whether to bypass trash and force deletion.",
                            "type": "boolean"
                        }
                    }
                }
            ]
        },
        "/wp/v2/sites": {
            "namespace": "wp/v2",
            "methods": [
                "GET",
                "POST"
            ],
            "endpoints": [
                {
                    "methods": [
                        "GET"
                    ],
                    "args": {
                        "context": {
                            "required": false,
                            "default": "view",
                            "enum": [
                                "view",
                                "embed",
                                "edit"
                            ],
                            "description": "Scope under which the request is made; determines fields present in response.",
                            "type": "string"
                        }
                    }
                },
                {
                    "methods": [
                        "POST"
                    ],
                    "args": {
                        "title": {
                            "required": false,
                            "description": "Site Title",
                            "type": "string"
                        },
                        "tagline": {
                            "required": false,
                            "description": "Tagline",
                            "type": "string"
                        },
                        "slug": {
                            "required": false,
                            "description": "An alphanumeric identifier for the site",
                            "type": "string"
                        },
                        "domain": {
                            "required": false,
                            "description": "Site Domain",
                            "type": "string"
                        }
                    }
                }
            ],
            "_links": {
                "self": "http://local.ucc.edu/wp-json/wp/v2/sites"
            }
        },
        "/wp/v2/sites/(?P<id>[\\d]+)": {
            "namespace": "wp/v2",
            "methods": [
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE"
            ],
            "endpoints": [
                {
                    "methods": [
                        "GET"
                    ],
                    "args": {
                        "context": {
                            "required": false,
                            "default": "view",
                            "enum": [
                                "view",
                                "embed",
                                "edit"
                            ],
                            "description": "Scope under which the request is made; determines fields present in response.",
                            "type": "string"
                        }
                    }
                },
                {
                    "methods": [
                        "POST",
                        "PUT",
                        "PATCH"
                    ],
                    "args": {
                        "title": {
                            "required": false,
                            "description": "Site Title",
                            "type": "string"
                        },
                        "tagline": {
                            "required": false,
                            "description": "Tagline",
                            "type": "string"
                        },
                        "slug": {
                            "required": false,
                            "description": "An alphanumeric identifier for the site",
                            "type": "string"
                        },
                        "domain": {
                            "required": false,
                            "description": "Site Domain",
                            "type": "string"
                        }
                    }
                },
                {
                    "methods": [
                        "DELETE"
                    ],
                    "args": {
                        "force": {
                            "required": false,
                            "default": false,
                            "description": "Whether to bypass trash and force deletion.",
                            "type": "boolean"
                        }
                    }
                }
            ]
        },
        "/wp/v2/pages/(?P<parent_id>[\\d]+)/meta": {
            "namespace": "wp/v2",
            "methods": [
                "GET",
                "POST"
            ],
            "endpoints": [
                {
                    "methods": [
                        "GET"
                    ],
                    "args": {
                        "context": {
                            "required": false,
                            "default": "edit",
                            "enum": [
                                "edit"
                            ],
                            "description": "Scope under which the request is made; determines fields present in response.",
                            "type": "string"
                        }
                    }
                },
                {
                    "methods": [
                        "POST"
                    ],
                    "args": {
                        "key": {
                            "required": true,
                            "description": "The key for the custom field.",
                            "type": "string"
                        },
                        "value": {
                            "required": false,
                            "description": "The value of the custom field.",
                            "type": "string"
                        }
                    }
                }
            ]
        },
        "/wp/v2/pages/(?P<parent_id>[\\d]+)/meta/(?P<id>[\\d]+)": {
            "namespace": "wp/v2",
            "methods": [
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE"
            ],
            "endpoints": [
                {
                    "methods": [
                        "GET"
                    ],
                    "args": {
                        "context": {
                            "required": false,
                            "default": "edit",
                            "enum": [
                                "edit"
                            ],
                            "description": "Scope under which the request is made; determines fields present in response.",
                            "type": "string"
                        }
                    }
                },
                {
                    "methods": [
                        "POST",
                        "PUT",
                        "PATCH"
                    ],
                    "args": {
                        "key": {
                            "required": false,
                            "description": "The key for the custom field.",
                            "type": "string"
                        },
                        "value": {
                            "required": false,
                            "description": "The value of the custom field.",
                            "type": "string"
                        }
                    }
                },
                {
                    "methods": [
                        "DELETE"
                    ],
                    "args": {
                        "force": {
                            "required": false,
                            "default": false,
                            "description": "Required to be true, as resource does not support trashing."
                        }
                    }
                }
            ]
        }
    }
};

