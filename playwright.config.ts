
import { defineConfig } from '@playwright/test';


 export default defineConfig ({
  workers: 1,
  timeout : 60*60*100000 ,
});