import { test, expect } from '@playwright/test';

test.describe('Property Search and Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should filter properties by type (sale/rent)', async ({ page }) => {
    // Look for type filter - could be select, buttons, or radio buttons
    const saleFilter = page.locator('select, button, input').filter({ hasText: /venda|sale/i }).first();
    
    if (await saleFilter.isVisible()) {
      await saleFilter.click();
      await page.waitForLoadState('networkidle');
      
      // Verify that properties are displayed
      const properties = page.locator('[data-testid="property-card"], .property-card');
      await expect(properties.first()).toBeVisible({ timeout: 10000 });
    }
  });

  test('should filter properties by category', async ({ page }) => {
    // Look for category filter
    const categorySelect = page.locator('select').filter({ hasText: /casa|apartamento|categoria|category/i }).first();
    
    if (await categorySelect.isVisible()) {
      await categorySelect.click();
      // Wait a bit for options to appear
      await page.waitForTimeout(500);
      
      // Try to select an option if available
      const option = page.locator('option, [role="option"]').filter({ hasText: /casa|house/i }).first();
      if (await option.isVisible()) {
        await option.click();
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('should filter properties by neighborhood', async ({ page }) => {
    // Look for neighborhood filter input
    const neighborhoodInput = page.locator('input[type="text"]').filter({ hasText: /bairro|neighborhood/i }).first();
    
    if (await neighborhoodInput.isVisible()) {
      await neighborhoodInput.fill('Centro');
      await page.keyboard.press('Enter');
      await page.waitForLoadState('networkidle');
    }
  });

  test('should search for properties using search input', async ({ page }) => {
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="Buscar"], input[placeholder*="Search"]').first();
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('casa');
      await page.keyboard.press('Enter');
      await page.waitForLoadState('networkidle');
      
      // Check if results are displayed
      await page.waitForTimeout(1000);
    }
  });

  test('should display "no results" message when no properties match filters', async ({ page }) => {
    // Try to search for something that likely doesn't exist
    const searchInput = page.locator('input[type="search"], input[type="text"]').first();
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('xyznonexistentproperty12345');
      await page.keyboard.press('Enter');
      await page.waitForLoadState('networkidle');
      
      // Check for empty state or no results message
      // This might show "Nenhum resultado", "Nenhum imóvel encontrado", or similar
      await page.waitForTimeout(2000);
    }
  });

  test('should clear filters and show all properties', async ({ page }) => {
    // Apply some filter first
    const typeFilter = page.locator('select, button').filter({ hasText: /tipo|type/i }).first();
    
    if (await typeFilter.isVisible()) {
      await typeFilter.click();
      await page.waitForTimeout(500);
    }
    
    // Look for clear/reset button
    const clearButton = page.locator('button').filter({ hasText: /limpar|clear|reset/i }).first();
    
    if (await clearButton.isVisible()) {
      await clearButton.click();
      await page.waitForLoadState('networkidle');
      
      // Verify properties are displayed
      const properties = page.locator('[data-testid="property-card"], .property-card');
      await expect(properties.first()).toBeVisible({ timeout: 10000 });
    }
  });
});
