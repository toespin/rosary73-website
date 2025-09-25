# Bead Images Setup Instructions

## Required Images from Mobile App

You need to download these bead images from the Rosary73 mobile app repository and place them in the `images/beads/` folder:

1. **bead_start.png** - Start a New Rosary bead
2. **bead_participate.png** - Join Active Rosaries bead
3. **bead_record.png** - Record Your Prayers bead
4. **bead_finished.png** - Listen to Finished Rosaries bead
5. **bead_group.png** - Create/Join Groups bead
6. **bead_gift.png** - Gift Subscriptions bead
7. **bead_subscribe.png** - Subscribe to Service bead

## Download Links

You can download the images from these direct links (you may need to be logged into GitHub):

- [bead_start.png](https://raw.githubusercontent.com/toespin/rosary73/main/assets/images/bead_start.png)
- [bead_participate.png](https://raw.githubusercontent.com/toespin/rosary73/main/assets/images/bead_participate.png)
- [bead_record.png](https://raw.githubusercontent.com/toespin/rosary73/main/assets/images/bead_record.png)
- [bead_finished.png](https://raw.githubusercontent.com/toespin/rosary73/main/assets/images/bead_finished.png)
- [bead_group.png](https://raw.githubusercontent.com/toespin/rosary73/main/assets/images/bead_group.png)
- [bead_gift.png](https://raw.githubusercontent.com/toespin/rosary73/main/assets/images/bead_gift.png)
- [bead_subscribe.png](https://raw.githubusercontent.com/toespin/rosary73/main/assets/images/bead_subscribe.png)

## Manual Download Steps

1. Create a folder: `images/beads/` in your rosary73-website repository
2. Download each image from the links above
3. Place them in the `images/beads/` folder
4. Commit and push the images to your repository

## Alternative: Using GitHub Raw URLs Directly

If you want to use the images directly from the mobile app repository without downloading, you can update the image sources in index.html to use the GitHub raw URLs directly. However, this is not recommended for production as it creates a dependency on the mobile app repository.

## Fallback Mode

The website has been updated with a fallback mode that shows colored circles with icons if the images fail to load, ensuring the carousel always displays properly.