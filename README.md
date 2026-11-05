# Blog

Site perso (Vite + React, thème clair/sombre, FR/EN).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # sortie dans dist/
```

## Écrire un article

1. Copier `content/posts/_template.md` vers `content/posts/mon-article.md`
   (le nom du fichier devient l'URL : `/writing/mon-article`).
2. Remplir le front-matter (`title`, `date`, `topic`, `subtopic`, `maturity`…).
3. Écrire en markdown, commit, push. Le site lit tous les `.md` au build.

Les fichiers qui commencent par `_` sont ignorés, et `hidden: true` masque un article.
Les images peuvent être mises à côté des articles (ex. `content/posts/images/x.png`)
et référencées en relatif : `![alt](./images/x.png "légende")`.

Extras markdown : callouts GitHub (`> [!NOTE]`, `[!TIP]`, `[!WARNING]`, `[!CAUTION] Titre`),
blocs de code avec nom de fichier (` ```bash title="script.sh" `), commandes une ligne
(` ```cmd `) et sorties de terminal (` ```terminal title="host" `).

## Le reste du contenu

Profil, liens, thèmes, projets, notes, /uses, CV : `src/data/site.ts`.
Couleurs : variables en haut de `src/styles.css`.

## SEO

- `public/robots.txt` et `public/llms.txt` sont servis à la racine.
- Renseigne `site.url` dans `src/data/site.ts` (ex. `https://moussa.nemiche.com`) pour
  générer `sitemap.xml` et la ligne `Sitemap:` dans `robots.txt` au build.

## Déploiement

Site statique. `dist/404.html` est généré pour que les liens profonds marchent sur GitHub Pages.
Pour un déploiement sous un sous-chemin : `BASE=/blog/ npm run build`.
La page « git log » et le pied de chaque article sont lus depuis l'historique git au moment du build
(en CI, faire un checkout complet : `fetch-depth: 0`).
