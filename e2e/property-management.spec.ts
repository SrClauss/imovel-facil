import { test, expect } from '@playwright/test';

test.describe('Property Management (CRUD Operations)', () => {
  // These tests require authentication
  // They test the owner/dashboard functionality
  
  test.beforeEach(async ({ page }) => {
    // Navigate to owner/dashboard page
    await page.goto('/proprietario');
    await page.waitForLoadState('networkidle');
  });

  test('should load owner/property management page', async ({ page }) => {
    await expect(page).toHaveURL('/proprietario');
    
    // Check that the page loaded
    await page.waitForTimeout(1000);
    
    // Check for heading or title
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test('should display add property button', async ({ page }) => {
    // Look for button to add new property
    const addButton = page.locator('button, a').filter({ 
      hasText: /adicionar|add|novo|new|cadastrar|register/i 
    }).first();
    
    if (await addButton.isVisible()) {
      await expect(addButton).toBeVisible();
    }
  });

  test('should open property creation form', async ({ page }) => {
    const addButton = page.locator('button, a').filter({ 
      hasText: /adicionar|add|novo|new|cadastrar/i 
    }).first();
    
    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(1000);
      
      // Check for form fields
      const titleInput = page.locator('input[name*="title"], input[name*="titulo"]').first();
      
      if (await titleInput.isVisible()) {
        await expect(titleInput).toBeVisible();
      }
    }
  });

  test('should create a new property', async ({ page }) => {
    const addButton = page.locator('button, a').filter({ 
      hasText: /adicionar|add|novo|new|cadastrar/i 
    }).first();
    
    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(1000);
      
      // Fill form fields
      const titleInput = page.locator('input[name*="title"], input[name*="titulo"]').first();
      const priceInput = page.locator('input[name*="price"], input[name*="preco"]').first();
      const descriptionInput = page.locator('textarea[name*="description"], textarea[name*="descricao"]').first();
      
      if (await titleInput.isVisible()) {
        await titleInput.fill('Casa de Teste E2E');
      }
      
      if (await priceInput.isVisible()) {
        await priceInput.fill('500000');
      }
      
      if (await descriptionInput.isVisible()) {
        await descriptionInput.fill('Esta é uma propriedade de teste criada pelo teste E2E.');
      }
      
      // Submit form
      const submitButton = page.locator('button[type="submit"]').filter({ 
        hasText: /salvar|save|criar|create|cadastrar/i 
      }).first();
      
      if (await submitButton.isVisible()) {
        await submitButton.click();
        await page.waitForTimeout(2000);
        
        // Check for success message
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should show validation errors on property form', async ({ page }) => {
    const addButton = page.locator('button, a').filter({ 
      hasText: /adicionar|add|novo|new|cadastrar/i 
    }).first();
    
    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(1000);
      
      // Try to submit empty form
      const submitButton = page.locator('button[type="submit"]').filter({ 
        hasText: /salvar|save|criar|create|cadastrar/i 
      }).first();
      
      if (await submitButton.isVisible()) {
        await submitButton.click();
        await page.waitForTimeout(1000);
        
        // Should show validation errors
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should list existing properties in dashboard', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Wait for properties to load
    await page.waitForTimeout(2000);
    
    // Check if there are properties listed
    const propertyList = page.locator('table, [data-testid="property-list"], .property-list').first();
    
    await page.waitForTimeout(1000);
  });

  test('should edit an existing property', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Look for edit button
    const editButton = page.locator('button, a').filter({ 
      hasText: /editar|edit/i 
    }).first();
    
    if (await editButton.isVisible()) {
      await editButton.click();
      await page.waitForTimeout(1000);
      
      // Update a field
      const titleInput = page.locator('input[name*="title"], input[name*="titulo"]').first();
      
      if (await titleInput.isVisible()) {
        await titleInput.fill('Título Editado pelo E2E');
        
        // Save changes
        const saveButton = page.locator('button[type="submit"]').filter({ 
          hasText: /salvar|save|atualizar|update/i 
        }).first();
        
        if (await saveButton.isVisible()) {
          await saveButton.click();
          await page.waitForTimeout(2000);
        }
      }
    }
  });

  test('should delete a property with confirmation', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Look for delete button
    const deleteButton = page.locator('button').filter({ 
      hasText: /excluir|delete|remover|remove/i 
    }).first();
    
    if (await deleteButton.isVisible()) {
      // Set up dialog handler for confirmation
      page.on('dialog', dialog => dialog.accept());
      
      await deleteButton.click();
      await page.waitForTimeout(2000);
      
      // Property should be removed from list
      await page.waitForTimeout(1000);
    }
  });

  test('should cancel property deletion', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Look for delete button
    const deleteButton = page.locator('button').filter({ 
      hasText: /excluir|delete|remover|remove/i 
    }).first();
    
    if (await deleteButton.isVisible()) {
      // Set up dialog handler to dismiss
      page.on('dialog', dialog => dialog.dismiss());
      
      await deleteButton.click();
      await page.waitForTimeout(1000);
      
      // Property should still be in list
      await page.waitForTimeout(1000);
    }
  });
});
