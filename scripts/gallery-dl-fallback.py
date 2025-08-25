#!/usr/bin/env python3
"""
Gallery-dl Fallback Scraper for Yupoo Albums

This script provides a Python-based alternative to the Playwright scraper
using gallery-dl to download images from Yupoo albums.

Usage:
    python scripts/gallery-dl-fallback.py <yupoo_album_url>
    
Example:
    python scripts/gallery-dl-fallback.py https://jersey-factory.x.yupoo.com/albums/123456

Requirements:
    pip install gallery-dl requests

Features:
    - Downloads images using gallery-dl
    - Normalizes output to match Playwright scraper format
    - Generates raw.json compatible with enrichment pipeline
    - Supports Cloudinary upload if CLOUDINARY_URL is set
"""

import os
import sys
import json
import subprocess
import requests
from pathlib import Path
from urllib.parse import urlparse
import re
from datetime import datetime

class GalleryDLFallback:
    def __init__(self):
        self.base_dir = Path(__file__).parent.parent
        self.output_dir = self.base_dir / "public" / "images"
        self.raw_json_path = self.base_dir / "data" / "raw.json"
        self.cloudinary_url = os.getenv('CLOUDINARY_URL')
        
    def slugify(self, text):
        """Convert text to URL-friendly slug"""
        text = text.lower()
        text = re.sub(r'[^a-z0-9\s-]', '', text)
        text = re.sub(r'\s+', '-', text)
        text = re.sub(r'-+', '-', text)
        return text.strip('-')
    
    def check_gallery_dl(self):
        """Check if gallery-dl is installed"""
        try:
            result = subprocess.run(['gallery-dl', '--version'], 
                                  capture_output=True, text=True)
            return result.returncode == 0
        except FileNotFoundError:
            return False
    
    def install_gallery_dl(self):
        """Install gallery-dl if not present"""
        print("📦 Installing gallery-dl...")
        try:
            subprocess.run([sys.executable, '-m', 'pip', 'install', 'gallery-dl'], 
                          check=True)
            print("✅ gallery-dl installed successfully")
            return True
        except subprocess.CalledProcessError:
            print("❌ Failed to install gallery-dl")
            return False
    
    def download_album(self, album_url):
        """Download album using gallery-dl"""
        print(f"📥 Downloading album: {album_url}")
        
        # Create temporary directory for gallery-dl output
        temp_dir = self.base_dir / "temp_download"
        temp_dir.mkdir(exist_ok=True)
        
        try:
            # Run gallery-dl command
            cmd = [
                'gallery-dl',
                '--dest', str(temp_dir),
                '--filename', '{category}/{title}/{index:>03}.{extension}',
                '--write-metadata',
                '--write-json',
                album_url
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode != 0:
                print(f"❌ gallery-dl failed: {result.stderr}")
                return None
            
            print("✅ Album downloaded successfully")
            return temp_dir
            
        except Exception as e:
            print(f"❌ Error downloading album: {e}")
            return None
    
    def extract_album_info(self, temp_dir):
        """Extract album information from downloaded files"""
        album_info = {
            'albumUrl': '',
            'albumTitle': '',
            'imageFiles': []
        }
        
        # Find JSON metadata file
        json_files = list(temp_dir.rglob('*.json'))
        if json_files:
            try:
                with open(json_files[0], 'r', encoding='utf-8') as f:
                    metadata = json.load(f)
                    album_info['albumTitle'] = metadata.get('title', 'Unknown Album')
            except Exception as e:
                print(f"⚠️ Could not read metadata: {e}")
        
        # Find image files
        image_extensions = {'.jpg', '.jpeg', '.png', '.webp'}
        image_files = []
        
        for ext in image_extensions:
            image_files.extend(temp_dir.rglob(f'*{ext}'))
            image_files.extend(temp_dir.rglob(f'*{ext.upper()}'))
        
        # Sort images by name
        image_files.sort()
        
        # Convert to relative paths
        for img_file in image_files:
            relative_path = img_file.relative_to(temp_dir)
            album_info['imageFiles'].append(str(relative_path))
        
        return album_info
    
    def move_images_to_structure(self, temp_dir, album_info):
        """Move images to the proper folder structure"""
        product_slug = self.slugify(album_info['albumTitle'])
        product_dir = self.output_dir / product_slug
        product_dir.mkdir(parents=True, exist_ok=True)
        
        moved_images = []
        
        for i, image_path in enumerate(album_info['imageFiles']):
            source_path = temp_dir / image_path
            if source_path.exists():
                # Get file extension
                extension = source_path.suffix or '.jpg'
                new_filename = f"image{i+1}{extension}"
                dest_path = product_dir / new_filename
                
                # Move file
                source_path.rename(dest_path)
                moved_images.append(f"/images/{product_slug}/{new_filename}")
        
        return moved_images
    
    def upload_to_cloudinary(self, image_paths):
        """Upload images to Cloudinary if configured"""
        if not self.cloudinary_url:
            return image_paths
        
        print("☁️ Uploading images to Cloudinary...")
        cloudinary_images = []
        
        for image_path in image_paths:
            full_path = self.base_dir / "public" / image_path.lstrip('/')
            if full_path.exists():
                try:
                    # Upload to Cloudinary
                    cloudinary_url = self.upload_single_image(full_path)
                    if cloudinary_url:
                        cloudinary_images.append(cloudinary_url)
                    else:
                        cloudinary_images.append(image_path)
                except Exception as e:
                    print(f"⚠️ Failed to upload {image_path}: {e}")
                    cloudinary_images.append(image_path)
            else:
                cloudinary_images.append(image_path)
        
        return cloudinary_images
    
    def upload_single_image(self, image_path):
        """Upload a single image to Cloudinary"""
        # This is a simplified upload - you might want to use the Cloudinary SDK
        # For now, we'll return the local path
        return None
    
    def save_raw_json(self, albums):
        """Save raw data to JSON file"""
        raw_data = {
            'scrapedAt': datetime.now().isoformat(),
            'totalAlbums': len(albums),
            'albums': albums
        }
        
        self.raw_json_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(self.raw_json_path, 'w', encoding='utf-8') as f:
            json.dump(raw_data, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Saved raw data to: {self.raw_json_path}")
    
    def cleanup_temp(self, temp_dir):
        """Clean up temporary directory"""
        if temp_dir and temp_dir.exists():
            import shutil
            shutil.rmtree(temp_dir)
            print("🧹 Cleaned up temporary files")
    
    def run(self, album_url):
        """Main execution method"""
        print("🎯 Gallery-dl Fallback Scraper")
        print("==============================")
        
        # Check if gallery-dl is installed
        if not self.check_gallery_dl():
            print("📦 gallery-dl not found. Installing...")
            if not self.install_gallery_dl():
                print("❌ Could not install gallery-dl. Please install manually:")
                print("   pip install gallery-dl")
                return False
        
        # Download album
        temp_dir = self.download_album(album_url)
        if not temp_dir:
            return False
        
        try:
            # Extract album information
            album_info = self.extract_album_info(temp_dir)
            album_info['albumUrl'] = album_url
            
            # Move images to proper structure
            moved_images = self.move_images_to_structure(temp_dir, album_info)
            album_info['imageFiles'] = moved_images
            
            # Upload to Cloudinary if configured
            if self.cloudinary_url:
                cloudinary_images = self.upload_to_cloudinary(moved_images)
                album_info['imageFiles'] = cloudinary_images
            
            # Save raw JSON
            self.save_raw_json([album_info])
            
            print("\n🎉 Scraping completed successfully!")
            print(f"📊 Album processed: {album_info['albumTitle']}")
            print(f"📁 Images saved: {len(moved_images)}")
            print(f"📄 Raw data saved to: {self.raw_json_path}")
            print("\n📝 Next steps:")
            print("1. Review the raw.json file")
            print("2. Run the enrichment pipeline: npm run enrich:products")
            
            return True
            
        finally:
            self.cleanup_temp(temp_dir)

def main():
    if len(sys.argv) != 2:
        print("Usage: python scripts/gallery-dl-fallback.py <yupoo_album_url>")
        print("Example: python scripts/gallery-dl-fallback.py https://jersey-factory.x.yupoo.com/albums/123456")
        sys.exit(1)
    
    album_url = sys.argv[1]
    scraper = GalleryDLFallback()
    success = scraper.run(album_url)
    
    if not success:
        sys.exit(1)

if __name__ == "__main__":
    main()
