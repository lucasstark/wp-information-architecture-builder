/*! 
 * 
 * Copyright (c) 2017;
 * Licensed GPLv2+
 */
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


;(function (global, $) {

    global.WPIAB = {
        App: {},
        views: {}
    };


    var WPArchitectureBuilder = function() {
        return new WPArchitectureBuilder.init();
    };

    WPArchitectureBuilder.prototype = {};

    WPArchitectureBuilder.init = function() {
        var self = this;
        self.rootData = {};
    };

    WPArchitectureBuilder.init.prototype = WPArchitectureBuilder.prototype;

    global.WPIAB.builder = WPArchitectureBuilder;


    WPIAB.getSiteTreeNode = function (node) {
        var parent = WPIAB.App.tree.jstree('get_node', node.parents[node.parents.length - 3]);
        return parent;
    };

    WPIAB.setLoading = function (loading, domNode) {
        if (loading) {
            if (domNode) {
                domNode.addClass("jstree-loading").attr('aria-busy', true);
            }

            $('.loading-icon').removeClass('fa-circle-o').addClass('fa-circle-o-notch fa-spin');

            $('#network_browser_tree').block({
                message: null,
                overlayCSS: {
                    background: '#fff',
                    opacity: 0.6
                }
            });

            //WPIAB.App.siteInfoPane.block();

        } else {
            if (domNode) {
                domNode.removeClass("jstree-loading").attr('aria-busy', false);
            }
            //WPIAB.App.siteInfoPane.unblock();

            $('#network_browser_tree').unblock();
            $('.loading-icon').removeClass('fa-circle-o-notch fa-spin').addClass('fa-circle-o');
        }
    };

    WPIAB.getNodeIcon = function (pageModel) {
        var icon = 'glyph-icon fa ' + (pageModel.get('has_children') ? 'fa-folder' : 'fa-file');
        var iconColor = '';
        switch (pageModel.get('migration_status')) {
            case 'new':
                iconColor = 'font-new';
                break;
            case 'in_progress' :
                iconColor = 'font-in-progress';
                break;
            case 'in_review' :
                iconColor = 'font-in-review';
                break;
            case 'complete' :
                iconColor = 'font-complete';
                break;
            default :
                iconColor = 'font-new';
                break;
        }

        return icon + ' ' + iconColor;

    };

})(window, jQuery);

;(function ($, WPIAB) {

    /**
     * The view for each page.  Has the title and other fields.
     */
    WPIAB.views.InfoPaneView = Backbone.View.extend({
        treeNode: {},
        //Template is in views/index.php
        template: _.template($('#info-pane-template').html()),
        el: $('#info-pane'),
        events: {
            "click .btn-save": "onSave",
            "click .btn-delete": "onDelete",
            "click .btn-cancel": 'onCancel',
            "change #migration-status": 'saveModel',
            'focusout .title': 'saveModel',
            'focusout #migration-notes': 'saveModel',
            'focusout #migration-old-url': 'saveModel'
        },
        initialize: function (options) {
            _.bindAll(this, 'onSave', 'onDelete', 'onCancel', 'updateModel', 'saveModel');
        },
        empty: function () {
            this.$el.empty();
        },
        render: function (modelView, treeNode) {

            this.modelView = modelView;
            this.model = modelView.model;
            this.treeNode = treeNode;
            this.empty();

            this.$el.html(this.template(this.model.attributes));
            this.$el.find('input.title').eq(0).focus(function () {
                $(this).select();
            });
        },
        onSave: function (e) {
            e.preventDefault();
            this.saveModel();
        },
        onDelete: function (e) {
            e.preventDefault();
        },
        onCancel: function (e) {
            e.preventDefault();
        },
        //Updates the model properties but does not sync it with the server.
        updateModel: function () {
            var updateRequired = false;

            var siteModel = this.modelView.siteView.model;
            var migration_status_previous = this.model.get('migration_status');

            var title = this.$el.find('input.title').eq(0).val();
            if (title !== this.model.get('title').rendered) {
                updateRequired = true;
                this.model.set('title', {
                    raw: title,
                    rendered: title
                });
            }

            var migration_notes = this.$el.find('#migration-notes').eq(0).val();
            if (this.model.get('migration_notes') !== migration_notes) {
                updateRequired = true;
                this.model.set('migration_notes', migration_notes);
            }


            var migration_old_url = this.$el.find('#migration-old-url').eq(0).val();
            if (this.model.get('migration_old_url') !== migration_old_url) {
                updateRequired = true;
                this.model.set('migration_old_url', migration_old_url);
            }

            //TODO:  Find a better way to keep this state in sync.
            var migration_status = this.$el.find('#migration-status').eq(0).val();
            if (migration_status_previous !== migration_status) {
                updateRequired = true;
                var migrationStatusCountPrevious = siteModel.get('migration_status_' + migration_status_previous);
                var migrationStatusCount = siteModel.get('migration_status_' + migration_status);
                this.model.set('migration_status', migration_status);
                siteModel.set('migration_status_' + migration_status, migrationStatusCount + 1);
                siteModel.set('migration_status_' + migration_status_previous, migrationStatusCountPrevious - 1);
            }

            return updateRequired;
        },
        //Save the model to the server, triggers the loading animations.
        saveModel: function () {
            var updateRequired = this.updateModel();
            if (updateRequired) {
                var self = this;

                var inst = $.jstree.reference(this.treeNode);
                var domNode = inst.get_node(this.treeNode, true);

                WPIAB.setLoading(true, domNode);
                this.block();

                this.model.save().done(function () {
                    inst.set_text(self.treeNode, self.model.get('title').rendered);
                    inst.set_icon(self.treeNode, WPIAB.getNodeIcon(self.model));

                    WPIAB.setLoading(false, domNode);
                    self.unblock();
                });
            }
        },
        //From blockui
        block: function () {
            this.$el.block({
                message: null,
                overlayCSS: {
                    background: '#fff',
                    opacity: 0.6
                }
            });
        },
        //From blockui
        unblock: function () {
            this.$el.unblock();
        }
    });

})(jQuery, WPIAB);
;(function ($, WPIAB) {


    //Contains the chart for the site information.
    WPIAB.views.SiteInfoPaneView = Backbone.View.extend({
        //Template is in views/index.php
        template: _.template($('#site-info-pane-template').html()),
        el: $('#site-info-pane'),
        initialize: function () {
            _.bindAll(this, "render", 'addPage', 'removePage');
            this.$plot = this.$el.find('.site-info-plot').eq(0);
            this.$content = this.$el.find('.site-info-content').eq(0);


        },
        switchModels: function (model, collection, siteTreeNode) {
            this.siteTreeNode = siteTreeNode;

            if (this.model) {
                this.stopListening(this.model);
            }

            if (this.collection) {
                this.stopListening(this.collection);
            }

            this.model = model;
            this.collection = collection;

            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.collection, 'add', this.addPage);
            this.listenTo(this.collection, 'remove', this.removePage);
            this.render(model);
        },
        //Renders the pie chart.
        render: function (model) {
            //Get's called when any of the models properties change and when an item is added or removed from the pages collection.

            this.block();

            this.$content.empty();
            this.$content.html(this.template(this.model.toJSON()));

            var data = [
                {
                    label: wp_iab_params.labels.migration_status_new,
                    data: this.model.get('migration_status_new'),
                    color: '#0073aa'
                },
                {
                    label: wp_iab_params.labels.migration_status_in_progress,
                    data: this.model.get('migration_status_in_progress'),
                    color: '#23282d'
                },
                {
                    label: wp_iab_params.labels.migration_status_in_review,
                    data: this.model.get('migration_status_in_review'),
                    color: '#984DFF'
                },
                {
                    label: wp_iab_params.labels.migration_status_complete,
                    data: this.model.get('migration_status_complete'),
                    color: '#12aa1b'
                },
            ];

            //Plot is defined in flot.js
            this.$plot.unbind();
            $.plot(this.$plot, data, {
                series: {
                    pie: {
                        show: true,
                        radius: 1,
                        label: {
                            show: true,
                            radius: 3 / 4,
                            formatter: this.labelFormatter,
                            background: {
                                opacity: 0.5
                            }
                        }
                    }
                }
            });
            this.unblock();
        },
        labelFormatter: function (label, series) {
            return "<div style='font-size:8pt; text-align:center; padding:2px; color:white;'>" + label + "<br/>" + Math.round(series.percent) + "%</div>";
        },
        block: function () {
            this.$el.block({
                message: null,
                overlayCSS: {
                    background: '#fff',
                    opacity: 0.6
                }
            });
        },
        unblock: function () {
            this.$el.unblock();
        },
        addPage: function (pageModel) {
            //When an item is added to the sites pages collection.
            //Update the status counts on this views model, which is a Site model.
            var count = this.model.get('migration_status_' + pageModel.get('migration_status'));
            this.model.set('migration_status_' + pageModel.get('migration_status'), count + 1);
        },
        removePage: function (pageModel) {
            //When an item is removed from the sites pages collection.
            //Update the status counts on this views model, which is a Site model.
            var count = this.model.get('migration_status_' + pageModel.get('migration_status'));
            this.model.set('migration_status_' + pageModel.get('migration_status'), count - 1);
        }
    });

})(jQuery, WPIAB);
;(function ($, WPIAB) {

    WPIAB.create_node = function (e, treeNodeData) {
        var parentNode;
        if (treeNodeData.node.type === 'site') {
            parentNode = treeNodeData.instance.get_node(treeNodeData.node.parent);

            var siteModel = new rootData.models.Sites({
                title: treeNodeData.node.text,
                domain: wp_iab_params.domain,
            });

            rootData.sitesCollection.add(siteModel);

            treeNodeData.node.data = {
                model: siteModel
            };

            treeNodeData.instance.deselect_all();
            treeNodeData.instance.select_node(treeNodeData.node);

        } else {
            //Get the parent tree view node.
            parentNode = treeNodeData.instance.get_node(treeNodeData.node.parent);

            //Reference to the site id.
            var siteTreeNode = WPIAB.getSiteTreeNode(treeNodeData.node);

            //If parent type is site post_parent will be 0, otherwise get the ID of the parent Page Model
            var parent_wp_id = parentNode.type === 'site' ? 0 : parentNode.data.model.id;

            var page_model = new siteTreeNode.data.api.models.Page({
                title: {
                    raw: treeNodeData.node.text,
                    rendered: treeNodeData.node.text
                },
                status: 'publish',
                parent: parent_wp_id,
                link: '',
                menu_order: parentNode.children.length + 1,
                migration_notes: '',
                migration_old_url: '',
                migration_content_status: '',
                migration_status: 'new',
            });

            //Add the new Page Model to the collection, but do not save it.
            //If we saved it here it would have the slug including 'Untitled'
            siteTreeNode.data.pages.add(page_model);

            //Add the Page Model reference to the tree node.
            treeNodeData.node.data = {
                model: page_model,
            };

            treeNodeData.instance.deselect_all();
            treeNodeData.instance.select_node(treeNodeData.node);
        }
    };
})(jQuery, WPIAB);
;(function ($, WPIAB) {

    WPIAB.load_data = function (node, cb) {
            var treeInstance = this;

            //This is the root node from jstree.  Here we want to use the sites collection, loaded in rootData.sitesCollection on initial page load.
            //Create a tree node for each Site model. This gives us the first level of the tree.
            if (node.id === '#') {
                network_sites = [];
                //Loop though each Site model and create a jstree node
                WPIAB.rootData.sitesCollection.each(function (site) {
                    network_sites.push({
                        id: 'site-' + site.id,
                        text: site.get('title'),
                        children: true,
                        type: 'site',
                        data: {
                            model: site,
                        }
                    });
                });

                //Call the jstree callback, setting children to each tree node which represents a Site model.
                cb.call(this,
                    {
                        id: 'root',
                        text: wp_iab_params.root_node_text,
                        children: network_sites,
                        type: 'network',
                        state: {
                            'opened': true,
                            'selected': false,
                            'disabled': false
                        },
                    }
                );
            } else {

                //This loads the first level of pages from a site.
                    if (node.parent === 'root') {

                    var site_id = node.data.model.id;

                    /*
                     Because of how WP API init works we need to load our models and collections from the rootData endpoint which
                     we have already loaded on initial page load.  If we don't do this the root site's objects will get the URL from the
                     last site we opened.

                     TODO:  Review using the wp.api.init method to build the Pages collection, seems like there should be a more efficent way.
                     */
                    if (site_id == wp_iab_params.root_site_id) {
                        node.data.api = {
                            models: {},
                            collections: {}
                        };

                        node.data.api.models = WPIAB.rootData.models;//Keep a reference to the models, not used but here for future use.
                        node.data.api.collections = WPIAB.rootData.collections;//Keep a reference to the collections, not used but here for future use.
                        node.data.pages = new node.data.api.collections.Pages();
                        //Tell the sites Pages collection to fetch it's data.
                        //Reset is set to false so that the collection is not emptied after the collection syncs.
                        node.data.pages.fetch({
                            merge: true, silent: true, add: true, remove: false,
                            data: {
                                'orderby': 'menu_order',
                                'order': 'asc',
                                'parent': 0,
                                'nopaging': true,
                            }
                        }).done(function (items) {
                            cb.call(treeInstance, items.map(function (post) {
                                    return {
                                        id: site_id + '-' + 'item-' + post.id,
                                        text: post.title.rendered,
                                        children: post.has_children,
                                        type: 'page',
                                        icon: WPIAB.getNodeIcon(node.data.pages.get(post.id)),
                                        data: {
                                            model: node.data.pages.get(post.id),
                                        }
                                    };
                                })
                            );
                        });

                    } else {
                        wp.api.init({
                            apiRoot: node.data.model.get('url') + '/wp-json/'
                        }).done(function () {

                            node.data.api = {
                                models: {},
                                collections: {}
                            };

                            //When the WP JSON client library completes here we need to copy models, collection and create a new instance of the Pages collection.
                            node.data.api.models = _.extend({}, this.models);//Keep a reference to the models, not used but here for future use.
                            node.data.api.collections = _.extend({}, this.collections);//Keep a reference to the collections, not used but here for future use.
                            node.data.pages = new node.data.api.collections.Pages();

                            //Tell the sites Pages collection to fetch it's data.
                            //Reset is set to false so that the collection is not emptied after the collection syncs.
                            node.data.pages.fetch({
                                merge: true, silent: true, add: true, remove: false,
                                data: {
                                    'orderby': 'menu_order',
                                    'order': 'asc',
                                    'parent': 0,
                                    'per_page': 100,
                                }
                            }).done(function (items) {

                                if (node.data.pages.hasMore()) {
                                    //TODO:  Determine a better method to handle this situation where there are more than 100 pages.
                                    alert('This site has more than 100 children at the root.   Consider moving pages into smaller sections.');
                                }

                                cb.call(treeInstance, items.map(function (post) {
                                        return {
                                            id: site_id + '-' + 'item-' + post.id,
                                            text: post.title.rendered,
                                            children: post.has_children,
                                            type: 'page',
                                            icon: WPIAB.getNodeIcon(node.data.pages.get(post.id)),
                                            data: {
                                                model: node.data.pages.get(post.id),
                                            }
                                        };
                                    })
                                );
                            });

                        });
                    }
                } else {
                    //Get the nodes parent site node.
                    //The site node has a reference to the collection for it's pages.
                    var siteTreeNode = WPIAB.getSiteTreeNode(node);

                    siteTreeNode.data.pages.fetch({
                        merge: true, silent: true, add: true, remove: false,
                        data: {
                            'orderby': 'menu_order',
                            'order': 'asc',
                            'parent': node.data.model.id,
                            //The WP REST api by default only allows 1 - 100 pages to be fetched at once.
                            'per_page': 100,
                        }
                    }).done(function (items) {

                        if (siteTreeNode.data.pages.hasMore()) {
                            //TODO:  Determine a better method to handle this situation where there are more than 100 pages.
                            alert('This page has more than 100 children.   Consider moving pages into smaller sections.');
                        }

                        cb.call(treeInstance, items.map(function (post) {
                            return {
                                id: siteTreeNode.data.model.id + '-' + 'item-' + post.id,
                                text: post.title.rendered,
                                children: post.has_children,
                                type: post.has_children ? 'default' : 'page',
                                icon: WPIAB.getNodeIcon(siteTreeNode.data.pages.get(post.id)),
                                data: {
                                    //Set the treenode's data.model property to the actual page model.
                                    model: siteTreeNode.data.pages.get(post.id),
                                }
                            };
                        }));
                    });
                }

            }
        };

})(jQuery, WPIAB);
;(function($, WPIAB){
    WPIAB.move_node = function (e, data) {
        //parent node is the new parent in jsTree.
        data.instance.deselect_all();
        var parentNode = data.instance.get_node(data.node.parent);
        var parentDomNode = data.instance.get_node(data.node.parent, true);
        var siteNode = WPIAB.getSiteTreeNode(parentNode);


        WPIAB.setLoading(true, parentDomNode);

        var parent_wp_id = 0;

        //if the parent is site, the wp parent id needs to remian 0
        if (parentNode.type !== 'site') {
            parent_wp_id = parentNode.data.model.id;
        }

        //Reset the icon to a folder, since we know for sure that it has children now.
        data.instance.set_icon(parent, 'glyph-icon fa fa-folder font-blue');

        var activeCalls = parentNode.children.length - data.position;

        var doneFunction = function (result) {
            //Remove the spinner from this specific item.
            $('#' + siteNode.data.model.id + '-item-' + result.id).removeClass('jstree-loading').attr('aria-busy', false);

            activeCalls--;
            if (activeCalls === 0) {
                data.instance.get_node(data.node.parent, true).removeClass("jstree-loading").attr('aria-busy', false);
                WPIAB.setLoading(false);
                WPIAB.App.switchView(data.node.data.model, data.node);
            }
        };

        for (var i = 0; i < parentNode.children.length; i++) {
            if (i >= data.position) {
                var child = data.instance.get_node(parentNode.children[i]);

                child.data.model.set('parent', parent_wp_id);
                child.data.model.set('menu_order', i);

                //Set the spinner on the individual item
                $('#' + siteNode.data.model.id + '-item-' + child.data.model.id).addClass('jstree-loading').attr('aria-busy', true);

                child.data.model.save().done(doneFunction);

            }
        }
    };
})(jQuery, WPIAB);

;(function ($, WPIAB) {
    WPIAB.node_changed = function (e, data) {

        if (data && data.selected && data.selected.length === 1 && (data.node.type == 'page' || data.node.type == 'default')) {
            var site_id = data.node.data.model.get('site_id');
            WPIAB.App.switchView(data.node.data.model, data.node);
        } else if (data && data.selected && data.selected.length === 1 && data.node.type === 'site') {
            WPIAB.App.switchView(data.node.data.model, data.node);
        }


    };
})(jQuery, WPIAB);
;(function ($, WPIAB) {
    WPIAB.rename_node = function (e, treeNodeData) {

        var domNode = $('#' + treeNodeData.node.id);

        if (treeNodeData.node.type === 'site') {
            treeNodeData.node.data.model.set('title', treeNodeData.node.text);
            treeNodeData.node.data.model.set('slug', ''); //empty slug so the server will generate it for us.
            WPIAB.setLoading(true, domNode);
            treeNodeData.node.data.model.save().done(function () {

                treeNodeData.node.children = true;
                treeNodeData.instance.refresh(treeNodeData.node);

                if (!treeNodeData.node.data.api) {
                    wp.api.init({
                        apiRoot: treeNodeData.node.data.model.get('url') + '/wp-json/'
                    }).done(function () {

                        treeNodeData.node.data.api = {
                            models: {},
                            collections: {}
                        };

                        treeNodeData.node.data.api.models = _.extend({}, this.models);
                        treeNodeData.node.data.api.collections = _.extend({}, this.collections);
                        treeNodeData.node.data.pages = new treeNodeData.node.data.api.collections.Pages();
                        WPIAB.setLoading(false, domNode);
                    });
                }
            });

        } else {
            if (treeNodeData.node.data.model.get('title') !== treeNodeData.node.text) {
                treeNodeData.node.data.model.set('title', {
                    raw: treeNodeData.node.text,
                    rendered: treeNodeData.node.text
                });

                WPIAB.setLoading(true, domNode);
                treeNodeData.node.data.model.save().done(function () {
                    WPIAB.App.switchView(treeNodeData.node.data.model, treeNodeData.node);
                    WPIAB.setLoading(false, domNode);
                });

            }
        }
    };
})(jQuery, WPIAB);
;(function ($, WPIAB) {



    //The API has been initialized already since we are passing in the schema directly.
    //It's not a mistake that we are not using the wp.api.loadPromise().done method.

    var temp = new wp.api.collections.Pages();

    var SiteModel = function (attributes, options) {
        wp.api.models.Sites.call(this, attributes, options);
    }

    SiteModel.prototype = Object.create(wp.api.models.Sites.prototype);

    SiteModel.prototype.getChildren = function () {
        return this.pages.fetch(0);
    }


    var PageModel = function (attributes, options) {
        wp.api.models.Page.call(this, attributes, options);
        this.baseUrl = this.collection.url();
    }

    PageModel.prototype = Object.create(wp.api.models.Page.prototype);

    PageModel.prototype.url = function () {

        var url = this.baseUrl;
        if (!_.isUndefined(this.get('id'))) {
            url += '/' + this.get('id');
        }
        return url;

    }


    PageModel.prototype.getChildren = function () {
        return this.collection.fetch(this.get('id'));
    }

    var PagesCollection = function (baseUrl, models, options) {
        wp.api.collections.Pages.call(this, models, options);
        this.model = PageModel;
        this.baseUrl = baseUrl;
    };

    PagesCollection.prototype = Object.create(wp.api.collections.Pages.prototype);

    PagesCollection.prototype.url = function () {
        return this.baseUrl + this.route.index;
    }

    PagesCollection.prototype.fetch = function (parent, options) {
        //Set the defaults for our fetch actions.
        options = _.extend({parse: true}, {
            merge: true, silent: true, add: true, remove: false,
            data: {
                'orderby': 'menu_order',
                'order': 'asc',
                'parent': parent,
                'per_page': 100,
            }
        });

        return wp.api.collections.Pages.prototype.fetch.call(this, options);
    }


    var SitesCollection = function (baseUrl, models, options) {
        wp.api.collections.Sites.call(this, models, options);
        this.model = SiteModel;
        this.baseUrl = baseUrl;
    }

    SitesCollection.prototype = Object.create(wp.api.collections.Sites.prototype);


    var PageView = function (siteView, model, jsTree) {
        this.model = model;
        this.siteView = siteView;
        this.jsTree = jsTree;
    }

    _.extend(PageView.prototype, Backbone.Events);

    PageView.prototype.onSelect = function (treeNode) {
        console.log(this.jsTree.get_node(this.getTreeNodeId()));
        this.trigger('builder:page:selected', this, treeNode);
    }

    PageView.prototype.getChildren = function () {
        return this.siteView.getChildren(this.model.get('id'));
    }

    PageView.prototype.onMoveNode = function (e, treeNodeData) {

        //parent node is the new parent in jsTree.
        treeNodeData.instance.deselect_all();

        var parentNode = treeNodeData.instance.get_node(treeNodeData.node.parent);
        var parentDomNode = treeNodeData.instance.get_node(treeNodeData.node.parent, true);
        var parent_wp_id = 0;

        //if the parent is site, the wp parent id needs to remian 0
        if (parentNode.type !== 'site') {
            parent_wp_id = parentNode.data.view.model.get('id');
        }

        //Reset the icon to a folder, since we know for sure that it has children now.
        treeNodeData.instance.set_icon(parent, 'glyph-icon fa fa-folder font-blue');

        var activeCalls = parentNode.children.length - treeNodeData.position;

        var doneFunction = function (result, childTreeNode) {
            //Remove the spinner from this specific item.

            $('#' + childTreeNode.view.getTreeNodeId()).removeClass('jstree-loading').attr('aria-busy', false);

            activeCalls--;
            if (activeCalls === 0) {
                treeNodeData.instance.get_node(data.node.parent, true).removeClass("jstree-loading").attr('aria-busy', false);
                //WPIAB.setLoading(false);
                //WPIAB.App.switchView(data.node.data.model, data.node);
            }
        };

        for (var i = 0; i < parentNode.children.length; i++) {
            if (i >= treeNodeData.position) {
                var child = treeNodeData.instance.get_node(parentNode.children[i]);

                child.data.view.model.set('parent', parent_wp_id);
                child.data.view.model.set('menu_order', i);

                //Set the spinner on the individual item
                $('#' + child.data.view.getTreeNodeId()).addClass('jstree-loading').attr('aria-busy', true);

                child.data.view.model.save().done(function (result) {
                    doneFunction(result, child);
                });
            }
        }
    }


    PageView.prototype.getSiteId = function () {
        return this.siteView.model.get('id');
    };

    PageView.prototype.getTreeNodeIcon = function () {
        var icon = 'glyph-icon fa ' + (this.model.get('has_children') ? 'fa-folder' : 'fa-file');
        var iconColor = '';
        switch (this.model.get('migration_status')) {
            case 'new':
                iconColor = 'font-new';
                break;
            case 'in_progress' :
                iconColor = 'font-in-progress';
                break;
            case 'in_review' :
                iconColor = 'font-in-review';
                break;
            case 'complete' :
                iconColor = 'font-complete';
                break;
            default :
                iconColor = 'font-new';
                break;
        }

        return icon + ' ' + iconColor;
    }

    PageView.prototype.getTreeNodeId = function () {
        return 'site-' + this.getSiteId() + '-' + 'item-' + this.model.get('id');
    }

    PageView.prototype.getTreeNode = function () {
        return this.tree.get_node(this.getTreeNodeId());
    }


    var SiteView = function (model, jsTree) {
        this.jsTree = jsTree;
        this.model = model;
        this.collection = new PagesCollection(model.get('url') + '/wp-json');
    }

    _.extend(SiteView.prototype, Backbone.Events);

    SiteView.prototype.onSelect = function (treeNode) {
        this.trigger('builder:site:selected', this, treeNode);
    }

    SiteView.prototype.getChildren = function (parentId) {
        var self = this;

        var deferred = jQuery.Deferred();
        var promise = deferred.promise();

        this.collection.fetch(parentId || 0).done(function (results) {
            var views = results.map(function (result) {
                return new PageView(self, self.collection.get(result.id), self.jsTree);
            });

            views.forEach(function (view) {
                self.listenTo(view, 'builder:page:selected', function (sender, treeNode) {
                    self.trigger('builder:page:selected', sender, treeNode);
                })
            });

            deferred.resolveWith(self, [views]);
        });

        return promise;

    }

    SiteView.prototype.getSiteId = function () {
        return this.model.get('id');
    }


    var NetworkView = function (baseUrl) {
        baseUrl = baseUrl || wp_iab_params.api_url;
        this.collection = new SitesCollection(baseUrl);
        this.views = [];
        this.infoPane = new WPIAB.views.InfoPaneView();
        this.siteInfoPane = new WPIAB.views.SiteInfoPaneView();
    }

    _.extend(NetworkView.prototype, Backbone.Events);

    NetworkView.prototype.getChildren = function () {
        var self = this;

        var deferred = jQuery.Deferred();
        var promise = deferred.promise();

        this.collection.fetch({data: {per_page: 0}}).done(function () {
            self.views = self.collection.map(function (model) {
                return new SiteView(model, self.jsTree);
            });

            self.views.forEach(function (view) {
                self.listenTo(view, 'builder:page:selected', function (sender, treeNode) {
                    self.infoPane.render(sender, treeNode);
                    self.siteInfoPane.switchModels(sender.siteView.model, sender.siteView.collection, treeNode);
                });

                self.listenTo(view, 'builder:site:selected', function (sender, treeNode) {
                    self.siteInfoPane.switchModels(sender.model, sender.collection, treeNode);
                });

            })

            deferred.resolveWith(self, [self.views]);
        });

        return promise;

    }


    var networkView = new NetworkView();


    $.jstree.defaults.core.themes.variant = "large";
    $.jstree.defaults.core.themes.stripes = true;

    networkView.tree = $('#network_browser_tree').jstree({
        'types': {
            'default': {},
            'page': {
                'valid_children': ['page']
            },
            'site': {
                'icon': "glyph-icon fa fa-globe font-green",
                'valid_children': ['page']
            },
            'network': {
                'icon': "glyph-icon fa fa-globe font-green",
                'valid_children': ['site']
            }
        },
        "plugins": [
            "types", "contextmenu", "dnd",
        ],
        'dnd': {
            //Disallow dragging of sites since there isn't an order to the sites in a multisite.
            'is_draggable': function (nodes) {
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].type === 'site') {
                        return false;
                    }
                }

                return true;
            }
        },
        'contextmenu': {
            'items': function (node) {
                var tmp = $.jstree.defaults.contextmenu.items();
                delete tmp.create.action;

                //If the id is root, it's the "Sites" top level node.  Set the context menu to allow creating a new site.
                if (node.id === 'root') {
                    tmp.create.label = wp_iab_params.labels.new_site;
                    tmp.create.separator_after = false;
                    tmp.create.separator_before = false;
                    tmp.create.action = function (data) {
                        var inst = $.jstree.reference(data.reference), obj = inst.get_node(data.reference);
                        inst.create_node(obj, {
                                type: 'site',
                                text: wp_iab_params.labels.new_site
                            },

                            'last', function (new_node) {
                                setTimeout(function () {
                                    inst.edit(new_node);
                                }, 0);
                            });
                    };

                    //Remove other actions since create site is the only allowed operation.
                    delete tmp.ccp;
                    delete tmp.rename;
                    delete tmp.remove;
                } else {
                    delete tmp.ccp;
                    //Context menu for any page.
                    //Reset the create action to create a new tree node and then call the edit function.
                    tmp.create.label = wp_iab_params.labels.new_page;
                    tmp.create.action = function (data) {
                        var inst = $.jstree.reference(data.reference), obj = inst.get_node(data.reference);
                        inst.create_node(obj, {
                                type: 'page',
                                icon: 'glyph-icon fa fa-file font-new',
                                text: wp_iab_params.labels.new_page
                            },

                            'last', function (new_node) {
                                //The actual Page model is saved when the rename action is finalized, which is called after jstree rename is complete.
                                setTimeout(function () {
                                    inst.edit(new_node);
                                }, 0);
                            });
                    };

                    //Reset the remove action to delete the page model.
                    tmp.remove.action = function (data) {
                        var inst = $.jstree.reference(data.reference);
                        var nodeToDelete = inst.get_node(data.reference);
                        var domNodeToDelete = inst.get_node(data.reference, true);

                        WPIAB.setLoading(true, domNodeToDelete);
                        nodeToDelete.data.model.destroy().done(function () {
                            setTimeout(function () {
                                inst.delete_node(nodeToDelete);
                                WPIAB.setLoading(false, domNodeToDelete);
                            }, 0);
                        });

                    };

                }

                return tmp;
            }
        },
        'core': {
            'multiple': false,
            'check_callback': function (operation, node, node_parent, node_position, more) {
                //TODO:  Allow dragging / copying between sites. Currently moving between sites is disabled.
                if (operation === 'move_node') {

                    if (node_parent.type === 'site') {
                        return false;
                    }

                    var current_node_site_id = node.data.view.getSiteId();
                    var new_node_site_id = node_parent.data.view.getSiteId();

                    if (current_node_site_id !== new_node_site_id) {
                        return false;
                    }
                }

                return true;
            },
            'data': function (node, cb) {
                var treeInstance = this;

                if (node.id === '#') {
                    networkView.jsTree = treeInstance;
                    networkView.getChildren().done(function (views) {
                        var self = this;

                        var treeItems = views.map(function (view) {
                            return {
                                id: 'site-' + view.model.id,
                                text: view.model.get('title'),
                                children: true,
                                type: 'site',
                                data: {
                                    view: view,
                                }
                            };
                        });

                        //Call the jstree callback, setting children to each tree node which represents a Site.
                        cb.call(treeInstance,
                            {
                                id: 'root',
                                text: wp_iab_params.root_node_text,
                                children: treeItems,
                                type: 'network',
                                state: {
                                    'opened': true,
                                    'selected': false,
                                    'disabled': false
                                },

                            }
                        );

                    });
                } else {
                    node.data.view.getChildren().done(function (pageViews) {
                        cb.call(treeInstance, pageViews.map(function (pageView) {
                            return {
                                id: pageView.getTreeNodeId(),
                                text: pageView.model.get('title').rendered,
                                children: pageView.model.get('has_children'),
                                type: pageView.model.get('has_children') ? 'default' : 'page',
                                icon: pageView.getTreeNodeIcon(),
                                data: {
                                    view: pageView
                                }
                            };
                        }));
                    })
                }
            }
        }
    })
        .on('loading_node.jstree', function (e, treeNodeData) {
            if (treeNodeData.node.type === 'site') {
                treeNodeData.node.data.view.onSelect(treeNodeData.node);
            }
            WPIAB.setLoading(true);
        })
        .on('load_node.jstree', function (e, treeNodeData) {
            WPIAB.setLoading(false);
        })
        .on('loaded.jstree', function (e, treeNodeData) {
            WPIAB.setLoading(false);
        })
        .on('create_node.jstree', function (e, treeNodeData) {
            WPIAB.create_node(e, treeNodeData);
        })
        .on('rename_node.jstree', function (e, treeNodeData) {
            WPIAB.rename_node(e, treeNodeData);
        })
        .on('move_node.jstree', function (e, treeNodeData) {
            treeNodeData.node.data.view.onMoveNode(e, treeNodeData);
        })
        .on('changed.jstree', function (e, treeNodeData) {
            if (treeNodeData && treeNodeData.selected && treeNodeData.selected.length === 1 && (treeNodeData.node.type == 'page' || treeNodeData.node.type == 'default')) {
                treeNodeData.node.data.view.onSelect(treeNodeData.node);
            } else if (treeNodeData && treeNodeData.selected && treeNodeData.selected.length === 1 && treeNodeData.node.type === 'site') {
                treeNodeData.node.data.view.onSelect(treeNodeData.node);
            }
            // WPIAB.node_changed(e, data);
        })
        .on('ready.jstree', function (e) {
            WPIAB.setLoading(false);
            $('.network_browser_tree_container').unblock();
        });


    $(document).ready(function () {
        function setHeight() {
            windowHeight = $(window).innerHeight();
            $('.network_browser_tree_container').css('height', windowHeight - 200);
            $('.wrap').css('height', windowHeight);
        }

        setHeight();

        $(window).resize(function () {
            setHeight();
        });
    });

    return;

    //Helper class to keep track of our main views.
    WPIAB.App = {
        infoPane: new WPIAB.views.InfoPaneView(),
        siteInfoPane: new WPIAB.views.SiteInfoPaneView(),
        switchView: function (model, treeNode) {
            if (treeNode.type === 'page' || treeNode.type === 'default') {
                this.infoPane.render(model, treeNode);
                var siteTreeNode = WPIAB.getSiteTreeNode(treeNode);
                this.siteInfoPane.switchModels(siteTreeNode.data.model, siteTreeNode.data.pages, siteTreeNode);
            } else if (treeNode.type === 'site') {
                this.infoPane.empty();
                this.siteInfoPane.switchModels(model, treeNode.data.pages, treeNode);
            }
        },
        tree: null
    };


    //rootData will be filled with a collection of Sites from our custom endpoint.
    WPIAB.rootData = {};

    //Show the loading animation on the network tree view while it's loading for the first time.
    $('.network_browser_tree_container').block({
        message: null,
        overlayCSS: {
            background: '#000',
            opacity: 0.2
        }
    });

    WPIAB.setLoading(true);


    //Initialize the API for the Sites endpoint.  Creates a collection of Site models and stores it in rootData.
    wp.api.init({
        apiRoot: wp_iab_params.api_url
    }).done(function () {

        WPIAB.rootData = {
            models: _.extend({}, this.models),
            collections: _.extend({}, this.collections),
            sitesCollection: new this.collections.Sites()
        };

        WPIAB.rootData.sitesCollection.fetch({data: {per_page: 0}}).done(loadTree);
    });

    //Initialize the tree and hook up all the actions.
    function loadTree() {
    }


    var testObject = {
        name: 'A',
        log: function () {
            this.name = 'B';

            var greeting = 'Hello';

            console.log(this);
            this.log2();

        },
        log2: function () {
            this.name = 'C';
            console.log(this);
        }
    };

    console.log(testObject);

    var logName = function () {
        console.log(this.greeting + ' Lucas');
    };

    testObject.log();

    var add = function (a, b) {
        return a + b;
    };

    console.log(add(1, 1));

    var addTen = add.bind(this, 10);
    console.log(addTen(10));


    var VariationForm = function () {
        this.propertyA = 'test';
    };

    VariationForm.prototype.testFunction = function () {
        console.log(this);
    };

    var vf = new VariationForm();
    vf.testFunction();


    var b = WPIAB.builder();
    console.log(b);


}(jQuery, WPIAB));
