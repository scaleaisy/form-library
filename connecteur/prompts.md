# Prompts prêts à l’emploi

À copier dans votre agent une fois le connecteur ScaleAIsy branché
([notice](README.md)). Remplacez ce qui est entre crochets.

## Démarrer

### Check-up de la connexion

> Lis https://github.com/scaleaisy/form-library/blob/main/connecteur/README.md.
> Appelle bien_demarrer, puis fais le check-up complet : à quoi tu es connecté, si tu
> peux modifier ou seulement lire, mon forfait, mes réglages, mes tunnels et mes
> chiffres récents. Présente-moi un état court (ce qui va, ce qui manque), puis un
> plan numéroté de 3 à 5 actions. Ne modifie rien avant mon accord.

### Configurer mon compte

> Avec le connecteur ScaleAIsy, appelle options_compte, puis pose-moi en une fois les
> questions utiles sur mon activité (offre, prospect idéal, prix, critères bloquants,
> panier moyen, taux de closing, niche, couleur). Rédige un contexte de qualification
> riche avec les gabarits de https://github.com/scaleaisy/form-library/blob/main/compte/README.md,
> prépare configurer_compte et donne-moi le lien de validation.

## Créer

### Premier tunnel

> Lis https://github.com/scaleaisy/form-library puis format_tunnel. Crée-moi un tunnel
> pour [mon offre], destiné à [ma cible], avec pour objectif [prise de rendez-vous /
> ressource / contact]. Propose d’abord les questions et la qualification, puis crée
> le brouillon avec creer_tunnel après mon accord et donne-moi le lien.

### Variante d’un tunnel existant

> Lis le tunnel « [nom] » avec lire_tunnel. Propose une variante plus courte, pensée
> pour [mobile / une campagne précise], et crée-la en brouillon après mon accord.

### Formulaire sur mesure

> Suis https://github.com/scaleaisy/form-library/tree/main/sur-mesure pour coder un
> formulaire sur mesure branché au tunnel « [nom] ». Appelle etat_sur_mesure à chaque
> étape et dis-moi où on en est.

## Analyser

### Diagnostic du compte

> Appelle analyse_compte et benchmark. Donne-moi les 3 points qui me font perdre le
> plus de ventes, chiffres à l’appui, et une correction concrète pour chacun.

### Pourquoi ce tunnel perd des visiteurs

> Pour le tunnel « [nom] », croise parcours_tunnel, scripts_videos et sources_tunnel.
> Dis-moi à quelle étape et pourquoi les visiteurs partent, puis propose les
> modifications du brouillon.

### Mes leads de la semaine

> Liste mes contacts les plus récents (7 derniers jours) avec lister_contacts. Résume les leads
> chauds à rappeler en premier, les objections qui reviennent et ce qu’elles disent
> de mon offre.

## Entretenir

### Ranger mes brouillons

> Liste mes tunnels. Propose-moi les brouillons à archiver et attends mon accord avant
> d’utiliser archiver_tunnels.

### Ce que tu as modifié

> Appelle historique_actions et résume ce qui a changé, ce qui attend ma validation et
> ce qui peut encore être annulé.

## Espace pro (agences)

### Check-up du portefeuille

> Appelle bien_demarrer, lister_mes_clients et synthese_portefeuille. Classe mes
> comptes clients du plus urgent au plus sain, dis-moi lesquels tu peux modifier et
> propose une action par compte.

### Bilan hebdomadaire pour un client

> Pour le compte client [nom], fais le bilan de la semaine (analyse_compte,
> lister_contacts, parcours_tunnel du tunnel principal) et rédige un message clair que
> je pourrai lui envoyer.

### Déployer un tunnel sur plusieurs comptes

> Prends le tunnel « [nom] » du compte [nom] et crée-le en brouillon sur les comptes
> [noms], en adaptant le nom et le contexte de chaque client. Montre-moi le plan avant.

### Mon propre tableau de bord

L’interface ScaleAIsy est pensée pour la performance de vos comptes, mais rien ne
vous y oblige : votre agent peut construire votre tableau de bord à vous, sur votre
ordinateur, avec les données que ScaleAIsy récolte.

> Construis-moi mon propre tableau de bord d’agence avec le connecteur ScaleAIsy.
> Commence par me demander ce que je veux voir (indicateurs, comptes clients, période,
> comparaisons), sous quelle forme (cartes, tableaux, graphiques, une page par client)
> et à quelle fréquence je le consulte. Montre-moi une maquette courte à valider, puis
> crée-le sur mon ordinateur (page HTML ou petite application locale) à partir de
> lister_mes_clients, synthese_portefeuille, analyse_compte et kpi_tunnel. Explique-moi
> enfin comment le mettre à jour.

Idées de contenu : classement des comptes par urgence, visiteurs → contacts →
rendez-vous → ventes par client, tunnels qui perdent le plus, leads chauds du jour,
évolution sur 7, 28 et 90 jours.
