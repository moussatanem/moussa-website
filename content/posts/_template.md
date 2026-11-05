---
# Files starting with "_" are ignored. Copy this file to my-post.md to start a post.
# The file name is the URL: content/posts/my-post.md -> /writing/my-post
title: Title of the post
description: One or two sentences shown under the title and in lists.
date: 2026-11-05
updated: 2026-11-05          # optional
topic: kubernetes            # slug or name of a topic in src/data/site.ts
subtopic: Cluster lifecycle  # one of that topic's subtopics (optional)
maturity: draft              # draft | in-progress | solid
lang: en                     # en | fr
translation: my-post-fr      # optional: slug of the same post in the other language
tags: [kubeadm, etcd]        # optional, used by search
hidden: false                # true = not published
---

## A section (h2 and h3 headings feed the "On this page" sidebar)

Normal **markdown**, `inline code`, [links](https://example.com), lists and tables.

> [!NOTE]
> Callouts: NOTE, TIP, IMPORTANT, WARNING, CAUTION. Add a custom title after the tag:
> `> [!CAUTION] What went wrong`

```bash title="script.sh"
# Code block with a file name in its header and a Copy button
echo "hello"
```

```cmd
kubectl get pods -A
```

```terminal title="my-host"
$ lines starting with $ are highlighted as prompts
output is shown as-is
```

![Alt text](./images/diagram.png "Caption shown under the image")
