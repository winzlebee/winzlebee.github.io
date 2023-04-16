---
title: "Migrating to Godot 4: A gotchas guide"
description: Transitioning to Godot 4 for one of my projects taught me a few things
date: "2023-04-16"
draft: false
tags: [Godot,Game,Development,Devlog,Tutorial]
---

## Transitioning to Godot 4

I've transitioned from Godot 3 to Godot 4 for one of my projects, one that I call 'Spacer' (working title of course)

It's a 3D godot project, and as such most of the tips I am going to mention here are going to be 3D-centric, however hopefully this can be of some use for 2D projects. Mainly, this is a way to write all

So without further delay, here are the issues that I ran into, in the order that I encountered them. One in particular may save you a fair amount of hair-pulling. I ran the default Godot conversion tool and the changes I have outlined below are ones that the tool missed in the current state.

### 1. Change raycasts to use the PhysicsRayQueryParameters3D structure

This one should be fairly self explanatory. The API for PhysicsDirectSpaceState3D (a parameter of GDScene that allows programmatic physics scene queries) has changed such that a data structure is now used for specifying the ray query parameters.


Change code that looks like this;

```gdscript

var space_state = get_world().direct_space_state

var rayLength = 20.0;
var rayOrigin = pOrigin - pDir * rayLength;
var rayDest   = pOrigin + pDir * rayLength;

var ignore = []
if instigator.get_ref():
    ignore.append(instigator.get_ref().hitbox)

var result = space_state.intersect_ray(rayOrigin, rayDest, ignore, 3, false, true)

```

to instead look like this;

```gdscript
var space_state = get_world_3d().direct_space_state

const rayLength = 20.0;

var ignore = []
if instigator.get_ref():
    ignore.append(instigator.get_ref().hitbox)

var params = PhysicsRayQueryParameters3D.new()

params.from = pOrigin - pDir * rayLength
params.to =  pOrigin + pDir * rayLength

params.exclude = ignore
params.collision_mask = 3
params.collide_with_bodies = false
params.collide_with_areas = true

var result = space_state.intersect_ray(params)
```

This is a very welcome change. I can now just glance at the code to see what I am doing with my collision masks!

### 2. The particle process material API has changed

I have some code that programmatically affects GPU particles by changing the velocity. I needed to change these calls. One welcome change here is we can now specify a velocity range, which looks stellar!

```gdscript
thruster.process_material.tangential_accel = # something
thruster.process_material.initial_velocity = # something
```

Becomes;

```gdscript
thruster.process_material.tangential_accel_min = # something
thruster.process_material.initial_velocity_min = # something
thruster.process_material.initial_velocity_max = thruster.process_material.initial_velocity_min * 2
```

Setting the maximum in this case as double was an arbitrary choice that looked nice in my case.
... and related to the above;

### 3. Particle process materials now have different parameters

This just means heading over to the relevant properties pane and changing things as necessary.

1. Particles are now emitted in the global frame. I needed to tick 'Local Coords' under 'Drawing'

{{< figure src="local-coords.png" title="Local particle coordinates" >}}

2. For some reason, the scale of my particles had changed. I tweaked them back using the 'Size' property under 'Draw Passes'

{{< figure src="particle-size.png" title="Particle Size" >}}

3. My emitter shapes were all gone
    - I just went ahead and re-defined them, copying the ones I had in the previous version of godot. Not sure I see a reason this did not upgrade - may be something for the bug tracker.
4. My sprite particle animation no longer played. I just needed to set a 'Speed Min' and 'Speed Max' in the process material

{{< figure src="particle-animation.png" title="Particle animation" >}}

### 4. Extending a base class no longer duplicates engine function calls

This one was a really big one, and represented a behaviour I did not even realise I relied on. In **Godot 3.x**, engine function calls on derived classes such as `_process()` and `_ready()` were automatically called in reverse-order of their depth in the inheritance heirachy, much like class constructors in other languages. In **Godot 4.x**, these functions are no longer called and need to be explicitly called using `super.func()`

So code like this;

```gdscript
func _process(delta):
	# Some cool processing of objects
    # Now the inherited class _process() is called automatically!
```

Becomes this;

```gdscript
func _process(delta):
	# Some cool processing of objects

    # We now need to explicitly call the function in the base class
	super._process(delta)
```

### 5. Moving from Bullet to the Godot Physics Engine

Some of my ship control code relied on specific values for angular damping. I needed to change these to work with the internal godot physics engine.

```gdscript
# Old values
self.set_linear_damp(-1)  # In bullet, this disabled damping
self.set_angular_damp(20) # The godot docs seem to indicate that this is related to the number of frames to settle

# The new angular and linear damping
self.set_linear_damp(0)  # Now this makes sense!
self.set_angular_damp(2) # Not sure about this one...
```

### 6. Materials are a bit messed up

I needed to re-assign all of my materials for my meshes. Even then, they didn't look quite how I remembered them.
Just re-drag any materials to any scenes you have with meshes in them.

### 7. Environment textures are cleared sometimes

With the new rendering engine and the new sky system, it seems like if you have an environment texture it is no longer loaded. Another thing I noticed is that I was using a *16-bit PNG* as an environment texture, and these no longer load as 16-bit textures.

Even worse, when loaded, they are compressed to a GPU-friendly format and look like they have been posterized to less than 512 colours. I'm still not sure why this happens!

To fix this;
1. If you are using 16-bit PNG environment images, convert them to be *.exr files using a tool like [GIMP](gimp.org)
2. Re-import the textures into Godot. The default settings should be fine
3. Re-assign the sky texture and fiddle until it looks right. The panoramic sky is still defined in a similar place;

{{< figure src="panorama-sky.png" title="Sky panorama texture" >}}

### 8. Multiplayer issues

The changes to the multiplayer system in Godot were thorough and very well thought out. You can read more about the new system in [this series of blog posts](https://godotengine.org/article/multiplayer-changes-godot-4-0-report-4/). Since this article, the API has changed very slightly, however most of the document is still relevant. Unfortunately, as of today the Godot Documentation has not been updated for Godot 4. The steps that were required for my project were;

1. The multiplayer singleton now lives in `multiplayer`
```gdscript
    # The code
    get_tree().set_multiplayer_peer(peer);

    # Becomes
	multiplayer.set_multiplayer_peer(peer);

    # Connecting signals
    multiplayer.connect("peer_connected", Callable(self, "_player_connected"))
	multiplayer.connect("peer_disconnected", Callable(self, "_player_disconnected"))

    # Getting the current peer ID
    multiplayer.get_unique_id()
```

2. I used `rpc_unreliable()` in some places. Replace all of these calls with `rpc()` and instead place the `unreliable` property on the annotation of the RPC function
```gdscript

# The code
rpc_unreliable("_puppet_update_target", autopilot_target_direction,
                                        autopilot_target_position,
                                        autopilot_shooting,
                                        autopilot_bank_amount)
# Becomes
rpc("_puppet_update_target", autopilot_target_direction,
                                        autopilot_target_position,
                                        autopilot_shooting,
                                        autopilot_bank_amount)

# Then we replace the annotation
# NOTE: This was the puppet keyword in Godot 3. The conversion tool automatically changed it
@rpc("unreliable_ordered")
func _puppet_update_target(dir, pos, shooting, bank_target):
	self.autopilot_target_direction = dir
	self.autopilot_target_position = pos
	self.autopilot_shooting = shooting
	self.autopilot_bank_amount = bank_target

```

## The project itself

Spacer is a 3D shooter project, with the 'Gimmick' designed to be a 3D-to-2D asymmetric mode that turns the game into something similar to [FTL](https://store.steampowered.com/app/212680/FTL_Faster_Than_Light/) when the mode is changed. So far, it just constitues a 3D part, which has a basic Freelancer-style control scheme and the ability to play over the internet. The next major step is, of course, adding 2D functionality!

<video style="width: 100%" controls autoplay>
    <source src="game-preview.webm" type="video/webm">
</video>