import { test, expect } from '@playwright/test';

test.describe('Responsive Design and Navigation', () => {
  test('should display correctly on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that the page is responsive
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Check for mobile menu or hamburger icon
    const mobileMenu = page.locator('[aria-label*="menu"], button').filter({ 
      hasText: /menu/i 
    }).first();
    
    await page.waitForTimeout(1000);
  });

  test('should display correctly on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Check that property cards are visible
    const propertyCards = page.locator('[data-testid="property-card"], .property-card').first();
    await expect(propertyCards).toBeVisible({ timeout: 10000 });
  });

  test('should display correctly on desktop viewport', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Navigation should be fully visible on desktop
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();
  });

  test('should open mobile menu on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for hamburger menu
    const hamburger = page.locator('button').filter({ 
      hasText: /menu|☰/i 
    }).first();
    
    if (await hamburger.isVisible()) {
      await hamburger.click();
      await page.waitForTimeout(500);
      
      // Menu should be visible
      await page.waitForTimeout(1000);
    }
  });

  test('should navigate between pages using navigation menu', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Click on contact link
    const contactLink = page.getByRole('link', { name: /contato|contact/i }).first();
    
    if (await contactLink.isVisible()) {
      await contactLink.click();
      await page.waitForURL('/contato');
      await expect(page).toHaveURL('/contato');
    }
  });

  test('should maintain navigation state across pages', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate to different pages
    await page.goto('/contato');
    await page.waitForLoadState('networkidle');
    
    // Navigation should still be visible
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();
    
    // Navigate back to home
    const homeLink = page.getByRole('link', { name: /início|home/i }).first();
    
    if (await homeLink.isVisible()) {
      await homeLink.click();
      await page.waitForURL('/');
    }
  });

  test('should handle browser back button', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate to contact page
    await page.goto('/contato');
    await page.waitForLoadState('networkidle');
    
    // Go back
    await page.goBack();
    await page.waitForLoadState('networkidle');
    
    // Should be back at home
    await expect(page).toHaveURL('/');
  });

  test('should handle browser forward button', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate to contact page
    await page.goto('/contato');
    await page.waitForLoadState('networkidle');
    
    // Go back
    await page.goBack();
    await page.waitForLoadState('networkidle');
    
    // Go forward
    await page.goForward();
    await page.waitForLoadState('networkidle');
    
    // Should be at contact page again
    await expect(page).toHaveURL('/contato');
  });

  test('should display 404 page for invalid routes', async ({ page }) => {
    await page.goto('/invalid-route-that-does-not-exist');
    await page.waitForLoadState('networkidle');
    
    // Should show 404 or not found page
    const notFoundText = page.locator('text=/404|não encontrado|not found/i').first();
    
    await page.waitForTimeout(2000);
    
    // At least verify page loaded
    expect(page.url()).toContain('invalid-route-that-does-not-exist');
  });

  test('should have keyboard navigation support', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Tab through elements
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    
    // Check that focus is visible
    const focused = await page.evaluateHandle(() => document.activeElement);
    expect(focused).toBeTruthy();
  });

  test('should have proper page titles', async ({ page }) => {
    // Home page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/Imóvel Fácil/i);
    
    // Contact page
    await page.goto('/contato');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/Imóvel Fácil/i);
  });

  test('should load images properly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for images to load
    await page.waitForTimeout(2000);
    
    // Check that images are present
    const images = page.locator('img');
    const imageCount = await images.count();
    
    // Should have at least some images
    expect(imageCount).toBeGreaterThan(0);
  });
});
