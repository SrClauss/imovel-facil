import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load home page successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads and has expected content
    await expect(page).toHaveTitle(/Imóvel Fácil/i);
    
    // Check for main navigation elements
    await expect(page.getByRole('navigation')).toBeVisible();
    
    // Check for hero section
    await expect(page.locator('text=Encontre seu imóvel ideal')).toBeVisible();
  });

  test('should display property listings', async ({ page }) => {
    await page.goto('/');
    
    // Wait for properties to load
    await page.waitForLoadState('networkidle');
    
    // Check that property cards are displayed
    const propertyCards = page.locator('[data-testid="property-card"], .property-card').first();
    await expect(propertyCards).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to property details when clicking on a property', async ({ page }) => {
    await page.goto('/');
    
    // Wait for properties to load
    await page.waitForLoadState('networkidle');
    
    // Click on the first property
    const firstProperty = page.locator('[data-testid="property-card"], .property-card').first();
    await firstProperty.waitFor({ state: 'visible', timeout: 10000 });
    await firstProperty.click();
    
    // Check that we're on the property details page
    await expect(page).toHaveURL(/\/imovel\/\d+/);
  });

  test('should show navigation bar with correct links', async ({ page }) => {
    await page.goto('/');
    
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();
    
    // Check for navigation links
    await expect(page.getByRole('link', { name: /início|home/i })).toBeVisible();
  });

  test('should show footer with contact information', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check for footer
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });
});
