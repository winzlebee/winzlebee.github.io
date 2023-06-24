---
title: "Making a shape tool for GIMP: Part One"
description: They often say something about meeting your heroes, this feels like being surrounded by them
date: "2023-06-24"
draft: true
tags: [Development,Free,Software,Open,Source,Shape,Tool,Gimp]
---

From when I was very young, I have been enamoured by desktop software. I still remember when I first started using a computer in the early 2000s.

I was under 10 years old and everything was new. Pictures loaded procedurally and you could watch the page load one element at a time, the framing and scaffolds of the page resizing as content loaded and filled ever-expanding spaces. There was a sense of wonder as the page loaded, and finally it all came together as a finished product. Almost like a delicate dance, things trading sizes with other things, collapsing and giving way. It was almost as if you were inside the mind of the web-designer, cobbling together the completed page from disparate components, building components haphazardly like a shanty town.

{{< figure src="https://i.stack.imgur.com/pOAAU.jpg" title="Ah, what a fantastic time">}}

It was somewhere among the columns of web content, the CSS grids that were strewn together with meticulous but fragile craft alongside 1-pixel-wide column images that managed to make sites juuust legible on old versions of Internet Explorer that I first began pulling these things apart. Like many kids of the era, I found the `Right Click -> Save Page As` shortcut. Just like that, I could have the website on my own computer, ready to view even when Mum was on a phone call! (Back in those days, on our DSL connection, a splitter was required for the phone. As was quite common for some reason, the splitter was never installed by our internet provider, and none of us knew better to add one. For many children of that era, the idea of needing to get a dose of internet in before a phone call shut it off became a point of commonality).

It wasn't long before these HTML files and directories with images were strewn across the desktop of the family PC. And not long after that, I discovered that they were editable. I could open them right up in `notepad.exe` and change things! At first, things broke every time I tweaked something. Resources online were scarce about web standards at this time, with [w3schools.com](https://w3schools.com) operating probably the best resource outside of books. Most was learned through experimentation, tweaking the source code little-by-little and seeing where things ended up.

By this point you may be wondering where I am going with all of this. Surely he has a point, surely there is a lesson to the proverb.

That much is true. Because I've been feeling again like that kid recently. As I've gotten older, and put on my big boy boots, and become decidedly *professional* about things, the effect of realising just how much *exists* becomes ever more all encompassing. I've been performing the same process again, feeling the computer archaeology whisk me away into a world slightly older than I am. Because I have been staring at the source code of [GIMP](https://gimp.org).

# Me and the GIMP

Editing text files is all well and good, and I could change the text and even figure out how to move things around. However, eventually I wanted to change how the *pictures* looked. After all, early web design used pictures for a great deal. My (only) tool at the time was Adobe Photoshop Elements 2.0

{{< figure src="https://archive.org/download/adobe-photoshop-elements-2-0/Adobe-Photoshop-Elements-2-0.jpg" title="Remembered fondly by the big sunflowers>}}

The software itself came bundled, free with a DSLR that my Dad had bought. It was promptly installed on the family PC and used by all of the kids. For me, it was everything I could have asked for. I could *paint*, I could *draw shapes*. If I was getting very advanced, I could even add a *new layer*. Any more functionality was inconceivable to me, and I'm not sure what I would have even done with it. The restrictions were empowering. I'm not sure I even knew more was possible. All of us would sit down with a goofy photo of one of us, then manipulate it bit by bit. Making liberal use of the filters dialog (especially the *liquify* tool)

