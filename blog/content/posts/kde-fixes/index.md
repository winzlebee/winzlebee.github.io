---
title: "Solving all the laggy things in KDE 6"
description: KDE 6 has some things that should be disabled for best usability and effect
date: "2026-02-05"
draft: false
tags: [KDE,free,software,desktop,krunner,launcher,menu,start,problem,freeze,launch,lag,tip,tutorial]
---

# Fixing slowdowns in KDE (6 or newer)

Recently I took to debugging reasons that my machine was having issues with lag when *typing* into the KDE application launcher. I'm also a heavy user of KRunner, and I was also having lag when using it. To summarise, when I begun I had all of the following symptoms

1. The KDE launcher ('Start Menu') was randomly and intermittently freezing and sometimes taking a long time to come up
2. KRunner (Called 'Plasma Search' in the UI and settings) was freezing and hitching, and sometimes only only coming up after a long delay.
3. When opening Dolphin, sometimes it would take up to 10 seconds to launch!
4. Even opening `kate` from the terminal took a long time to launch
5. Entering 'edit mode' of the panels freezes for a very long time, eventually delivering all keyboard/mouse events at once.

It turns out all problems (and problems like them) aren't just caused by one thing, there's a whole host of things that can go wrong and bad default configurations in KDE that can cause this sort of thing. I'm putting this up here as a lighthouse for anybody with similar issues in the hope of slightly improving humanity (and sanity).

Here's all the things I did. After each one, my desktop environment got a little bit better.

>**NOTE:** You might want to backup-and-reset your KDE configuration to the default before doing this, to help isolate things a little better. Here's how you do that.

> ```bash
> mv ~/.config/Trolltech.conf ~/.config/Trolltech.conf.bak
> for j in plasma*; do mv -- "$j" "${j%}.bak"; done
> kbuildsycoca6 --noincremental
> ```

>Then reboot

## Disable Baloo

I know it's supposed to work. I know it's been tested a banillion times and the squoogles of it are 6 times squooglier in newer versions of KDE, but sorry. It's taking 50% of my CPU when I save certain files into my home drive.

I recommend disabling it completely by unchecking `System Settings > File Search > Enabled`

You can check you've done it correctly using `balooctl6 status` or `balooctl6 monitor`. Note that a lot of sources online haven't adopted the '6' that we now need to plug at the end.

## Re-build the recent files database

The recent files database can get some corrupted rows, which slows Dolphin down. Clear it (backing it up just in case) then do a reboot.

```bash
systemctl --user stop plasma-kactivitymanagerd.service
mv ~/.local/share/kactivitymanagerd ~/.local/share/kactivitymanagerd_backup
```

## Disable clipboard history

I had some relatively large **video files** in my clipboard history. I had no idea it was possible to copy video files in this manner, but I guess it makes sense. Somehow, this seemed to slow down all Qt input fields in the OS and environment.
Disable it by right-clicking the little clipboard icon on the tray and pressing 'Configure Clipboard...'. Then turn everything off.
Of course feel free to leave some of the features on if you wish to keep using them, but *I'm not a user of clipboard history*.

<img width="902" height="708" alt="image" src="https://gist.github.com/user-attachments/assets/e12d4508-679c-4154-8113-06faccd5246c" />

## Clear the icon and thumbnail cache

Sometimes these get into a funny state.

```bash
rm ~/.cache/icon-cache.kcache
rm -rf ~/.cache/thumbnails/
```
## Remove any left-over gnome or GTK xdg-desktop-portal integrations

Using your preferred package manager, search for things that depend on `xdg-desktop-portal`. If someone would like to give me instructions for other distributions I'd be glad to add them here.

```bash
pacman -Qs xdg-desktop-portal
```
If you see any `xdg-desktop-portal-gnome` or `xdg-desktop-portal-gtk` remove them.

```bash
sudo pacman -Rdd xdg-desktop-portal-gtk xdg-desktop-portal-gnome
```

## Remove any and all network drives from automount

Take a look at your `/etc/fstab` and remove any network drives. Sorry, I'm serious. Just mount them when you need them.
Someone smarter than me can probably figure out a way to make these not lag Dolphin but I found dolphin kept querying metadata on random recent files from it, causing a huge slowdown when opening.

## Disable everything slow in KRunner

Some things in KRunner talk to the internet. I know it's all async and all that jazz, but turning them off seemed to help somehow for me.

Go ahead and hit `Alt+Space` to bring up KRunner, hit the 'Configure' button then 'Configure Enabled Search Plugins'. Here's what I turned off;

```
Web Search Keywords
Software Center
Dictionary
Spell Checker
Kate Sessions
```

# General system things I did that also might help

1. If you're on an Arch derivative, make sure you maintain your **.pacnew* files well. There are tools to automatically do it for you.
2. I've noticed a lot of people **don't have a swapfile**. I was in this group. Create one with roughly the same size as your system RAM and turn it on.
