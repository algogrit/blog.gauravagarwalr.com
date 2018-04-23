---
title: "Setting up Nvidia TX1 Dev board with JetPack 3.2 and SSD with a bonus"
canonicalUrl: https://blog.gauravagarwalr.com/posts/2018-04-10-setting-up-nvidia-tx1
license: all-rights-reserved
featuredImage: https://blog.gauravagarwalr.com/assets/images/03-setup-nvidia-tx1.jpg
tags: nvidia-tx1,dev-board,tinkering,jetpack,docker
published: true
---

Disclaimer: This post is more or less a transcript of the videos by Jim from [jetsonhacks.com][JetsonHacksSite].

I am a beginner to the world of machine learning and own a couple of Macbooks. I found the Nvidia Dev board (TX1) to be the best way to get started and run a few tensorflow / Cuda code on. Before I could do that, I had to make sure it was usable, and that was much more than I had bargained for.

# Setup JetPack 3.2 on TX1

Annoyingly, the Nvidia TX1 Dev board is not directly flashable via a usb stick. You need a host machine where you setup the dev board using the 'Force Recovery USB Mode'. You can find a video of setup using an older version of JetPack [here][JetPack-3.0Video].

## Host Setup (Macbook Air with Ubuntu)
I used an old Mac book as my host. I downloaded the [Ubuntu 16.04 Desktop][UbuntuISO] iso and created a bootable USB stick using hypriot's [flash][flashTool] tool. I highly recommend using this tool.

Once the Ubuntu installation was completed, I set out to download [JetPack][JetPackDownload] 3.2 from Nvidia Developer site.

From the terminal, I changed the permission on the downloaded JetPack to make it an executable. And ran it on the command line. It launches a wizard, which you can follow to install on the host.

The download and install takes ~2 hour. YMMY depending on your download speed. Once the host install is completed, the program automatically proceeds to the target installation.

## Target Setup (Nvidia TX1)
To start the target setup, you need to connect the TX1, using the provided USB cord, to the host machine and switch to 'Force Recovery USB Mode'. The instructions for which are printed on the screen.

Caveat: The installation is usually smooth and if you see it hang near the line "Sending BCT..." or something similar, either change the port on your host machine or change the cord. I had it working using a different cord.

You should also connect your Board via ethernet port to a LAN, which the Host is connected to.

Press enter, once you are ready. Most probably everything will install smoothly, as it did in my case. You might lose wifi connectivity on the host (if using wifi) a couple of times. Don't worry, it happens. The most important thing is that the connection on the target is not flaky.

## Testing the setup

The JetPack installation, comes with its own car detection sample. You can see it in action, and also test your setup, by running:

```bash
  $ ~/tegra_multimedia_api/samples/backend/backend 1 \
  ../../data/Video/sample_outdoor_car_1080p_10fps.h264 H264 \
  --trt-deployfile ../../data/Model/GoogleNet_one_class/GoogleNet_modified_oneClass_halfHD.prototxt \
  --trt-modelfile ../../data/Model/GoogleNet_one_class/GoogleNet_modified_oneClass_halfHD.caffemodel \
  --trt-forcefp32 0 --trt-proc-interval 1 -fps 1
```

Hopefully, you found it simple to setup the Nvidia TX1 with Ubuntu 16.04. If you want to install an SSD, continue reading.

# Install SSD

TX1 comes with a built in capacity of ~16 GB, out of which, the above installation takes about >8 GB. It leaves us with very little space to work with. One option was to install a SD card using the provided slot, I wanted much more. I wanted to run the OS on a [~256 GB SSD][WDSSD-Amazon.com]. You can follow the [video][SSDSetupVideo], or read along.

## Format SSD and copy files to SSD

After you have physically connected your SSD, you should see the SSD show up when you boot the Dev Board. The first thing you should do is format it, using the Disks utility.

I chose EXT4 as the format. I had left about 10 GB of free space on the partition to avoid SSD [wear and tear][SSDFreeSpace].

Once that is done copy the files from the emmc to the SSD, using:

```bash
  $ sudo cp -ax / /media/ubuntu/NAME_OF_YOUR_SSD_DRIVE
```

You can find the name by checking Disks utility or by running `df -h` command. This would take a while, depending on your SSD speed. Took me ~3 minutes.

## Edit bootconfig to Boot from SSD

To use the SSD as our main startup disk, I will need to edit the bootconfig in `/boot/extlinux`.

The original file looks like:

```bash
  $ cat /boot/extlinux/extlinux.conf
```
```snippet
TIMEOUT 30
DEFAULT primary

MENU TITLE p2371-2180 eMMC boot options

LABEL primary
      MENU LABEL primary kernel
      LINUX /boot/Image
      INITRD /boot/initrd
      APPEND ${cbootargs} root=/dev/mmcblk0p1 rw rootwait
```

Backup the original file, using:

```bash
  $ sudo cp /boot/extlinux/extlinux.conf /boot/extlinux/extlinux.conf.original
```

Edit it, using vim/gedit/nano, to look like:

```bash
  $ sudo gedit /boot/extlinux/extlinux.conf
```
```snippet
TIMEOUT 30
DEFAULT satassd

MENU TITLE p2371-2180 eMMC boot options

LABEL satassd
      MENU LABEL primary SATA SSD
      LINUX /boot/Image
      INITRD /boot/initrd
      APPEND ${cbootargs} root=/dev/sda1 rw rootwait

LABEL emmc
      MENU LABEL Internal eMMC
      LINUX /boot/Image
      INITRD /boot/initrd
      APPEND ${cbootargs} root=/dev/mmcblk0p1 rw rootwait
```

I renamed primary to emmc, and added another block for satassd. And edited it accordingly.

Once this is done, Reboot. You should now see an "SD Icon" instead of the SSD. That is the internal eMMC. Test the installation and you are good to go!

One other advantage of using an SSD, apart from speed and size is the fact that the entire installation is intact on the eMMC. In case of issues, you can disconnect the SSD and format it again.

# Bonus: Setup docker

I am a huge fan of containerization. I have see a lot of projects messing up an environment quickly because of conflicting dependencies. To counter that you can install docker using:

```bash
  $ sudo apt-get install docker.io
```

It is as simple as that from 'Ubuntu 16.04' and 'JetPack 3.2' onwards. I haven't been able to find the `device_query` image which is referenced in [this forum][NvidiaDockerForum]. Let me know, if you were able to get the following command working:

```bash
  $ docker run --device=/dev/nvhost-ctrl --device=/dev/nvhost-ctrl-gpu --device=/dev/nvhost-prof-gpu --device=/dev/nvmap --device=/dev/nvhost-gpu --device=/dev/nvhost-as-gpu -v /usr/lib/aarch64-linux-gnu/tegra:/usr/lib/aarch64-linux-gnu/tegra device_query
```

Hopefully, you have found this post useful. Please leave your comments and questions in the disqus thread below.

[JetsonHacksSite]: http://www.jetsonhacks.com/
[JetPack-3.0Video]: https://www.youtube.com/watch?v=D7lkth34rgM
[UbuntuISO]: https://www.ubuntu.com/download/desktop/thank-you?version=16.04.4&architecture=amd64
[flashTool]: https://github.com/hypriot/flash
[JetPackDownload]: https://developer.nvidia.com/embedded/jetpack
[WDSSD-Amazon.com]: https://www.amazon.com/gp/product/B01LXDQX35/ref=oh_aui_detailpage_o00_s00
[SSDSetupVideo]: https://www.youtube.com/watch?v=6nzWt42mzqk
[SSDFreeSpace]: https://superuser.com/questions/1256074/how-much-space-to-leave-free-on-hdd-or-ssd
[NvidiaDockerForum]: https://devtalk.nvidia.com/default/topic/1017272/docker-on-tx1-or-tx2-/
