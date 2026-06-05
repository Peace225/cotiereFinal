# Corrections des boutons "Ajouter" dans l'admin

## Problème identifié

Plusieurs pages admin avec bouton "Ajouter" avaient des **erreurs silencieuses** : quand l'API retournait une erreur (403 Forbidden si non connecté, 400 Bad Request, etc.), le modal se fermait sans rien sauvegarder et **aucun message d'erreur n'était affiché**.

Cela donnait l'impression que l'ajout avait fonctionné, mais en réalité rien n'était sauvegardé en base de données.

---

## Pages corrigées

### ✅ 1. Hébergement — Chambres
**Fichier** : `app/(admin)/admin/hebergement/page.tsx`  
**Route API** : `POST /api/rooms`  
**Correction** : Ajout de gestion d'erreur explicite dans `saveRoom()` avec `alert()` si `res.ok === false`

### ✅ 2. Excursions
**Fichier** : `app/(admin)/admin/excursions/page.tsx`  
**Route API** : `POST /api/excursions`  
**Correction** : Ajout de gestion d'erreur explicite dans `saveExcursion()` avec `alert()` si `res.ok === false`

### ✅ 3. Location — Équipements
**Fichier** : `app/(admin)/admin/location/page.tsx`  
**Route API** : `POST /api/equipment`  
**Correction** : Ajout de gestion d'erreur explicite dans `saveEquipment()` avec `alert()` si `res.ok === false`

### ✅ 4. Calendrier — Blocage de dates
**Fichier** : `app/(admin)/admin/calendrier/page.tsx`  
**Route API** : `POST /api/availability`  
**Correction** : 
- Ajout de gestion d'erreur explicite dans `blockDate()` avec `alert()` si `res.ok === false`
- **Ajout de `requireAdmin()` dans la route API** (elle n'avait aucune protection !)

### ✅ 5. Opportunités — Secteurs
**Fichier** : `app/(admin)/admin/opportunites/page.tsx`  
**Route API** : `POST /api/opportunites/secteurs`  
**Correction** : Déjà corrigé précédemment avec gestion d'erreur complète

---

## Routes API sécurisées

### ✅ `/api/availability` (POST et DELETE)
**Avant** : Aucune vérification d'authentification  
**Après** : Ajout de `requireAdmin()` pour POST et DELETE

Toutes les autres routes utilisent déjà `requireAdmin()` correctement.

---

## Middleware de protection

**Fichier créé** : `middleware.ts` (à la racine du projet)  
**Fonction** : Redirige vers `/connexion` si un utilisateur non connecté tente d'accéder à `/admin/*`

---

## Pages avec état local uniquement (pas de persistance DB)

Ces pages ont un bouton "Ajouter" mais **ne sauvegardent pas en base de données** — les données sont perdues au rechargement :

- ❌ **Musique** (`admin/pages/musique/page.tsx`) — `saveService()` modifie uniquement le state local
- ❌ **Studio** (`admin/pages/studio/page.tsx`) — `saveService()` modifie uniquement le state local
- ❌ **Médias** (`admin/pages/page.tsx`) — `saveSupport()` modifie uniquement le state local
- ❌ **Info** (`admin/pages/info/page.tsx`) — `savePrestation()` modifie uniquement le state local
- ❌ **Véhicules** (`admin/pages/vehicules/page.tsx`) — `saveVehicule()` modifie uniquement le state local

**Recommandation** : Créer des routes API et des modèles Prisma pour ces services si la persistance est nécessaire.

---

## Incohérence détectée

**Opportunités** : Il existe **deux versions** de la page admin :
- `admin/pages/opportunites/page.tsx` — utilise state local uniquement (pas d'API)
- `app/(admin)/admin/opportunites/page.tsx` — utilise l'API avec `requireAdmin()` ✅

**Recommandation** : Supprimer la version obsolète dans `admin/pages/` ou la synchroniser avec la version dans `app/(admin)/admin/`.

---

## Test en production

Pour vérifier que tout fonctionne :

1. **Connecte-toi en tant qu'admin** sur le site en production
2. Va dans chaque page admin (Hébergement, Excursions, Location, Calendrier, Opportunités)
3. Clique sur "Ajouter" et remplis le formulaire
4. Si tu n'es **pas connecté** ou si la **session a expiré**, tu verras maintenant une alerte claire :
   ```
   Erreur 403 : Forbidden
   Vérifiez que vous êtes connecté en tant qu'admin.
   ```
5. Si tu **es connecté**, l'élément sera sauvegardé et apparaîtra dans la liste

---

## Résumé des fichiers modifiés

```
✅ app/(admin)/admin/hebergement/page.tsx
✅ app/(admin)/admin/excursions/page.tsx
✅ app/(admin)/admin/location/page.tsx
✅ app/(admin)/admin/calendrier/page.tsx
✅ app/(admin)/admin/opportunites/page.tsx (déjà corrigé)
✅ app/api/availability/route.ts (ajout requireAdmin)
✅ middleware.ts (nouveau fichier)
```

---

## Prochaines étapes recommandées

1. **Déployer ces corrections en production**
2. **Tester chaque bouton "Ajouter"** en étant connecté
3. **Décider si les pages Musique, Studio, Info, Véhicules, Médias doivent persister en DB** (actuellement elles ne le font pas)
4. **Nettoyer la duplication** entre `admin/pages/` et `app/(admin)/admin/` (deux versions de certaines pages)

---

Date de correction : 15 mai 2026
